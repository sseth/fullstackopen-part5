import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import Blog from './Blog';

describe('blog div content', () => {
  let container;
  beforeEach(() => {
    const user = {
      name: 'user0',
      username: 'abcd',
      id: '1',
    };

    const blog = {
      title: 'Post 2134',
      url: 'https://test.com/abesdf',
      likes: 8743,
      author: 'test author',
      user,
    };

    container = render(<Blog blog={blog} user={user} />).container;
  });

  test('title and author rendered by default, but not likes and url', () => {
    const blogDiv = container.querySelector('.blog');
    expect(blogDiv).toHaveTextContent('Post 2134 by test author');

    let element = screen.queryByText('likes: 8743');
    expect(element).toBeNull();

    element = screen.queryByText('https://test.com/abesdf');
    expect(element).toBeNull();
  });

  test(
    'likes and url displayed/hidden on clicking view/hide button',
    async () => {
      const viewButton = screen.getByText('view');
      const user = userEvent.setup();
      await user.click(viewButton);

      const blogDiv = container.querySelector('.blog');
      expect(blogDiv).toHaveTextContent('Post 2134 by test author');
      const likes = screen.getByText('likes: 8743');
      expect(likes).toBeDefined();

      const userInfo = screen.getByText('added by you');
      expect(userInfo).toBeDefined();
      const removeButton = screen.getByText('remove');
      expect(removeButton).toBeDefined();

      const hideButton = screen.getByText('hide');
      expect(hideButton).toBe(viewButton);
      await user.click(viewButton);
      expect(screen.queryByText('likes: 8743')).toBeNull();
    }
  );
});

test('clicking "like" calls event handler once per click', async () => {
  const User = {
    name: 'user0',
    username: 'abcd',
    id: '1',
  };

  const blog = {
    title: 'Post 2134',
    url: 'https://test.com/abesdf',
    likes: 8743,
    author: 'test author',
    user: { ...User, id: 2 },
  };

  const likeHandler = jest.fn();
  render(<Blog blog={blog} user={User} likePost={likeHandler} />);

  const viewButton = screen.getByText('view');
  const user = userEvent.setup();
  await user.click(viewButton);

  const likeButton = screen.getByText('like');
  await user.click(likeButton);
  await user.click(likeButton);
  expect(likeHandler.mock.calls).toHaveLength(2);
  expect(screen.findByText('added by abcd')).toBeDefined();
});
