import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import AddNewBlog from './AddNewBlog';

test('form passes new blog details to event handler', async () => {
  const mockHandler = jest.fn();
  render(<AddNewBlog createPost={mockHandler}/>);
  const user = userEvent.setup();

  const blog = {
    title: 'Post 2134',
    url: 'https://test.com/abesdf',
    author: 'test author',
  };

  const inputs = screen.getAllByRole('textbox');
  await user.type(inputs[0], blog.title);
  await user.type(inputs[1], blog.author);
  await user.type(inputs[2], blog.url);

  const addButton = screen.getByText('add');
  await user.click(addButton);

  expect(mockHandler.mock.calls).toHaveLength(1);
  expect(mockHandler.mock.lastCall[0]).toEqual(blog);
});
