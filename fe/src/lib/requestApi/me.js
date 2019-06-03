import API from '../api';

async function me(requestHandler) {
  const request = await requestHandler(API.currentUser.endpoint, API.currentUser.method);

  return request;
}

export default me;
