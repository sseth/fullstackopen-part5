import { useState, useEffect, useRef } from 'react';
import { blogService, loginService } from './services';
import { Blog, AddNewBlog, Notification, Login, Togglable } from './components';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notif, setNotif] = useState({ msg: '', error: false });
  const newBlogRef = useRef();

  const fetchBlogs = () => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs))
      .catch((e) => {
        console.error(e);
        setNotif({ msg: e.message, error: true });
      });
  };

  const getUserFromLocalStorage = () => {
    const u = localStorage.getItem('user');
    if (u) {
      const userOb = JSON.parse(u);
      setUser(userOb);
      blogService.setToken(userOb.token);
    }
  };

  const setNotifTimer = () => {
    if (notif.msg === '') return;
    const timer = setTimeout(() => setNotif({ msg: '', error: false }), 5000);
    return () => clearTimeout(timer);
  };

  useEffect(fetchBlogs, []);
  useEffect(getUserFromLocalStorage, []);
  useEffect(setNotifTimer, [notif]);

  const logIn = async (credentials) => {
    const { username, password } = credentials;

    try {
      const res = await loginService.logIn({ username, password });
      setUser(res);
      blogService.setToken(res.token);
      localStorage.setItem('user', JSON.stringify(res));
    } catch (error) {
      console.error(error);
      let msg = 'Login failed';
      if (error.response.status === 401) msg += ': incorrect password';
      else if (error.response.data.error)
        msg += `: ${error.response.data.error}`;
      setNotif({ msg, error: true });
    }
  };

  const logOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const like = async (blog) => {
    try {
      await blogService.edit(blog.id, {
        ...blog,
        user: blog.user.id,
        likes: blog.likes + 1,
      });
      const newBlogs = await blogService.getAll();
      setBlogs(newBlogs);
    } catch (e) {
      console.error(e);
      // setNotif({ msg: 'lol', error: true });
    }
  };

  const remove = async (blog) => {
    const conf = window.confirm(`Remove ${blog.title} by ${blog.author}?`);
    if (!conf) return;

    try {
      await blogService.remove(blog.id);
      setNotif({ msg: 'Deleted post', error: false });
      const newBlogs = await blogService.getAll();
      setBlogs(newBlogs);
    } catch (e) {
      console.error(e);
      setNotif({ msg: 'Could not delete post', error: true });
    }
  };

  const create = async (blog) => {
    const { title, author, url } = blog;
    if (!title) return setNotif({ msg: 'Title is required', error: true });
    if (!url) return setNotif({ msg: 'URL is required', error: true });

    try {
      await blogService.create({ title, author, url });
      newBlogRef.current.toggleVisibility();
      const newBlogs = await blogService.getAll();
      setBlogs(newBlogs);
      setNotif({
        msg: `New blog post '${title}'${author ? ' by ' + author : ''} added`,
        error: false,
      });
    } catch (error) {
      console.error(error);
      setNotif({ msg: 'Could not add new blog post', error: true });
    }
  };

  return user ? (
    <div>
      <h2>blogs</h2>
      <Notification notif={notif} />
      <div>
        <span>logged in as {user.name} </span>
        <button onClick={logOut}>log out</button>
      </div>
      <br />
      <Togglable buttonLabel="create blog" ref={newBlogRef}>
        <AddNewBlog createPost={create} />
      </Togglable>
      <br />
      <div className="bloglist">
        {blogs
          .sort((a, b) => a.likes - b.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              likePost={like}
              deletePost={remove}
            />
          ))}
      </div>
    </div>
  ) : (
    <Login login={logIn} notif={notif} />
  );
};

export default App;
