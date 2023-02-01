import axios from 'axios';
const baseUrl = '/api/login';

const logIn = async (credentials) => {
  const res = await axios.post(baseUrl, credentials);
  return res.data;
};

const loginService = { logIn };
export default loginService;
