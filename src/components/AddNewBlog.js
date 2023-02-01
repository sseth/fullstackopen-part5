import { useState } from 'react';
import { blogService } from '../services';

const AddNewBlog = ({ setBlogs, setNotif, newBlogRef }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const create = async () => {
    if (!title) return setNotif({ msg: 'Title is required', error: true });
    if (!url) return setNotif({ msg: 'URL is required', error: true });

    try {
      await blogService.create({ title, author, url });
      newBlogRef.current.toggleVisibility();
      const newBlogs = await blogService.getAll();
      setBlogs(newBlogs);
      setTitle('');
      setAuthor('');
      setUrl('');
      setNotif({
        msg: `New blog post '${title}'${author ? ' by ' + author : ''} added`,
        error: false,
      });
    } catch (error) {
      console.error(error);
      setNotif({ msg: 'Could not add new blog post', error: true });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') setTitle(value);
    if (name === 'author') setAuthor(value);
    if (name === 'url') setUrl(value);
  };

  return (
    <div>
      <h2 style={{ marginTop: 5 }}>add new blog</h2>
      <form>
        <div>
          <label htmlFor="title">title </label>
          <input
            id="title"
            name="title"
            value={title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="author">author </label>
          <input
            id="author"
            name="author"
            value={author}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="url">url </label>
          <input id="url" name="url" value={url} onChange={handleChange} />
        </div>
        <input type="button" value="add" onClick={create} />
      </form>
    </div>
  );
};

export default AddNewBlog;
