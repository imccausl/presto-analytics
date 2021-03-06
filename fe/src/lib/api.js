require('dotenv').config({ path: '../../../.env' });

const API = {
  root: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : ''}/api`,
  send: (body, method = 'POST') => {
    let reqMethod = method;

    if (typeof body === 'string') {
      reqMethod = body;
    }

    const sendData = {
      method: reqMethod,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (reqMethod.toLowerCase() !== 'get') {
      sendData.body = JSON.stringify(body);
    }

    return sendData;
  },

  currentUser: {
    method: 'GET',
    endpoint: '/v1/user/me',
  },
  deleteAccount: {
    method: 'DELETE',
    endpoint: '/v1/user/me/delete',
  },
  updateAccountDetails: {
    method: 'POST',
    endpoint: userId => `/v1/user/details/${userId}`,
  },
  login: '/login',
  logout: {
    endpoint: '/logout',
    method: 'GET',
  },
  register: '/signup',

  monthlyTransactions: (cardNumber, year, month) => {
    let searchMonth = month;
    let searchYear = year;

    if (year.length <= 2) {
      searchYear = new Date().getFullYear().toString();
      searchMonth = year;
    }

    return `/v1/transaction/${cardNumber}/monthly/${searchYear}/${searchMonth}`;
  },
  transactionRange: (cardNumber, days) => `/v1/transaction/${cardNumber}/range?days=${days}`,
  allTransactions: {
    method: 'GET',
    endpoint: '/v1/transaction',
  },
  yearToDate: {
    method: 'GET',
    endpoint: '/v1/transaction/ytd',
  },
  yearToDateData: {
    method: 'GET',
    endpoint: '/v1/transaction/ytd/data',
  },
  updateBudget: {
    method: 'POST',
    endpoint: '/v1/budget',
  },
  prestoUsage: '/v1/presto/usage',
  prestoLogin: { endpoint: '/v1/presto/login', method: 'POST' },
  prestoCheckLogin: { endpoint: '/v1/presto/check-login', method: 'GET' },
};

export default API;
