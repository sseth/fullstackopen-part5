import { useState, useEffect, useRef } from 'react';
import { Blog, AddNewBlog, Notification, Login, Togglable } from './components';
import { blogService } from './services';

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

  const logOut = () => {
    setUser(null);
    localStorage.removeItem('user');
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
      <Togglable buttonLabel="new blog" ref={newBlogRef}>
        <AddNewBlog
          setBlogs={setBlogs}
          setNotif={setNotif}
          newBlogRef={newBlogRef}
        />
      </Togglable>
      <br />
      <div>
        {blogs
          .sort((a, b) => a.likes - b.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              setNotif={setNotif}
              setBlogs={setBlogs}
            />
          ))}
      </div>
    </div>
  ) : (
    <Login setUser={setUser} notif={notif} setNotif={setNotif} />
  );
};

export default App;
