const API = {
  root: 'http://localhost:3333/api/v1',
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
    endpoint: '/me',
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

    return `/transactions/monthly/${searchYear}/${searchMonth}`;
  },
  allTransactions: {
    method: 'GET',
    endpoint: '/transactions/all',
  },
  yearToDate: {
    method: 'GET',
    endpoint: '/transactions/ytd',
  },
  yearToDateData: {
    method: 'GET',
    endpoint: '/transactions/ytd/data',
  },
  prestoUsage: '/presto/usage',
};

export default API;
