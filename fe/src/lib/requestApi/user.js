import API from '../api';

async function logout(requestHandler) {
  const request = await requestHandler(API.logout.endpoint, API.logout.method);

  return request;
}

export { logout };
