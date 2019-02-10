import fetch from 'isomorphic-unfetch';
import API from '../api';

async function sendRequest(fetchHandler, path, method, opts = {}) {
  const ROOT_URL = `${API.root}`;
  const headers = Object.assign({}, opts.headers || {}, {
    'Content-Type': 'application/json; charset=UTF-8',
  });

  const response = await fetchHandler(
    `${ROOT_URL}${path}`,
    Object.assign({ method, credentials: 'include' }, opts, {
      headers,
      body: JSON.stringify(opts.body),
    }),
  );

  const data = await response.json();

  // commented this out because I don't know how necessary it is.
  // the logic behind it was to detect errors such as not logged in, etc. and have special
  // error handling for them on the FE, but it just causes crashes and I might
  // be able to do this better without having it. Keeping it here for now as a TODO reminder.

  // if (data.error) {
  //   throw new Error(data.error);
  // }

  return data;
}

const sendRequestWrapper = fetchHandler => (path, method, opts) => sendRequest(fetchHandler, path, method, opts);

export default sendRequestWrapper(fetch);
