import API from '../api';

async function prestoLogin(requestHandler, username, password) {
  const response = await requestHandler(API.prestoLogin.endpoint, API.prestoLogin.method, {
    body: { username, password },
  });

  return response;
}

async function prestoIsLoggedIn(requestHandler) {}

export { prestoLogin };
