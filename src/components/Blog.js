import { useState } from 'react';

const Blog = ({ blog, user, likePost, deletePost }) => {
  const [showDetails, setShowDetails] = useState(false);

  const styles = {
    padding: 5,
    marginBottom: 5,
    border: '2px solid black',
    borderRadius: 5,
  };

  return (
    <>
      <div className="blog" style={styles}>
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
              <button onClick={() => likePost(blog)}>like</button>
            </div>
            <div>
              added by {blog.user.id === user.id ? 'you' : blog.user.name}
            </div>
            {blog.user.id === user.id && (
              <button onClick={() => deletePost(blog)}>remove</button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Blog;
