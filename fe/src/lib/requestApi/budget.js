import API from '../api';

async function updateBudget(requestHandler, body = {}) {
  const request = await requestHandler(API.updateBudget.endpoint, API.updateBudget.method, {
    body: {
      ...body,
    },
  });

  return request;
}

export { updateBudget };
