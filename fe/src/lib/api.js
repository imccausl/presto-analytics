const API = {
  root: 'http://localhost:3333/api',
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
  login: '/login',
  logout: {
    endpoint: '/logout',
    method: 'GET',
  },
  register: '/signup',

  monthlyTransactions: (year, month) => {
    let searchMonth = month;
    let searchYear = year;

    if (year.length <= 2) {
      searchYear = new Date().getFullYear().toString();
      searchMonth = year;
    }

    return `/v1/transaction/monthly/${searchYear}/${searchMonth}`;
  },
  transactionRange: days => `/v1/transaction/range?days=${days}`,
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
    endpoint: '/v1/budget/save',
  },
  prestoUsage: '/v1/presto/usage',
  prestoLogin: { endpoint: '/v1/presto/login', method: 'POST' },
  prestoCheckLogin: { endpoint: '/v1/presto/check-login', method: 'GET' },
};

export default API;
