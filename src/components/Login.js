import { useState } from 'react';
import Notification from './Notification';
import { blogService, loginService } from '../services';

const Login = ({ setUser, notif, setNotif }) => {
  const [username, setUsername] = useState('abcd1234');
  const [password, setPassword] = useState('sdlkjf987');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'password') setPassword(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginService.logIn({ username, password });
      setUser(res);
      blogService.setToken(res.token);
      localStorage.setItem('user', JSON.stringify(res));
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error(error);
      let msg = 'Login failed';
      if (error.response.status === 401) msg += ': incorrect password';
      else if (error.response.data.error)
        msg += `: ${error.response.data.error}`;
      setNotif({ msg, error: true });
    }
  };

  return (
    <div>
      <h2>log in</h2>
      <Notification notif={notif} />
      <form>
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
        <input type="button" value="log in" onClick={handleLogin} />
      </form>
    </div>
  );
};

export default Login;
