const API = {
  root: 'http://localhost:3333/api/v1',
  send: (body, method = 'POST') => ({
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }),

  login: '/login',
  register: '/signup',
  monthlyTransactions: (year, month) => {
    let searchMonth = month;
    let searchYear = year;

    if (year.length <= 2) {
      searchYear = new Date().getFullYear().toString();
      searchMonth = year;
    }

    return `/${searchYear}{searchMonth}`;
  },

  prestoUsage: year => `/presto/usage/${year}`,
};

export default API;
