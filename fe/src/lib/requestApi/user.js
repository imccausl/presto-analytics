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

async function updateUserDetails(requestHandler, userId, details = {}) {
  const request = await requestHandler(
    API.updateAccountDetails.endpoint(userId),
    API.updateAccountDetails.method,
    {
      body: {
        ...details,
      },
    },
  );

  return request;
}

export { logout, deleteAccount, updateUserDetails };
