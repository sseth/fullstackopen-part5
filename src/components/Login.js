import { useState } from 'react';
import PropTypes from 'prop-types';
import Notification from './Notification';

const Login = ({ notif, login }) => {
  // const [username, setUsername] = useState('abcd1234');
  // const [password, setPassword] = useState('sdlkjf987');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'password') setPassword(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await login({ username, password });
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <h2>log in</h2>
      <Notification notif={notif} />
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">username </label>
          <input
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">password </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" id="login">log in</button>
      </form>
    </div>
  );
};

Login.propTypes = {
  notif: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
};

export default Login;
