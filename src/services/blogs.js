import axios from 'axios';
const baseUrl = '/api/blogs';

let token;

const setToken = (t) => {
  token = t;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (data) => {
  const res = await axios.post(baseUrl, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const edit = async (id, data) => {
  const res = await axios.put(`${baseUrl}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const remove = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// eslint-disable-next-line
export default { getAll, setToken, create, edit, remove };
