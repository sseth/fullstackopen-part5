import { useState } from 'react';

const AddNewBlog = ({ createPost }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') setTitle(value);
    if (name === 'author') setAuthor(value);
    if (name === 'url') setUrl(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createPost({ author, title, url });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2 style={{ marginTop: 5 }}>add new blog</h2>
      <form onSubmit={handleSubmit}>
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
        <button id="add" type="submit">
          add
        </button>
      </form>
    </div>
  );
};

export default AddNewBlog;
