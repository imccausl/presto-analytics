import fetch from 'isomorphic-unfetch';
import API from '../api';

async function sendRequest(fetchHandler, path, method, opts = {}) {
  const ROOT_URL = `${API.root}`;
  const headers = Object.assign({}, opts.headers || {}, {
    'Content-Type': 'application/json; charset=UTF-8',
  });

  const response = await fetchHandler(
    `${ROOT_URL}${path}`,
    Object.assign({ method, credentials: 'include' }, opts, { headers }),
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

const sendRequestWrapper = fetchHandler => (path, method, opts) => sendRequest(fetchHandler, path, method, opts);

export default sendRequestWrapper(fetch);
