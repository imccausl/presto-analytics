import API from '../api';

async function logout(requestHandler) {
  const request = await requestHandler(API.logout.endpoint, API.logout.method);

  return request;
}

async function deleteAccount(requestHandler) {
  const request = await requestHandler(API.deleteAccount.endpoint, API.deleteAccount.method, {
    body: { verify: 'yes' },
  });

  return request;
}

export { logout, deleteAccount };
