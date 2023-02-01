import { useState } from 'react';
import { blogService } from '../services';

const Blog = ({ blog, user, setNotif, setBlogs }) => {
  const [showDetails, setShowDetails] = useState(false);

  const likePost = async () => {
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

  const deletePost = async () => {
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

  const styles = {
    padding: 5,
    marginBottom: 5,
    border: '2px solid black',
    borderRadius: 5,
  };

  return (
    <>
      <div style={styles}>
        <div style={{ fontWeight: showDetails ? 'bold' : 'normal' }}>
          {blog.title} by {blog.author} &nbsp;
          <button onClick={() => setShowDetails((x) => !x)}>
            {showDetails ? 'hide' : 'view'}
          </button>
        </div>
        {showDetails && (
          <>
            <a href={blog.url}>{blog.url}</a>
            <div>
              likes: {blog.likes} &nbsp;
              <button onClick={likePost}>like</button>
            </div>
            <div>{blog.user.name}</div>
            {blog.user.id === user.id && (
              <button onClick={deletePost}>remove</button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Blog;
