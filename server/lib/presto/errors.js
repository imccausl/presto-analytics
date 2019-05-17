class ConnectionError extends Error {
  constructor(message) {
    super(message);

    this.name = 'ConnectionError';
  }

  statusCode(code) {
    this.statusCode = code;
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);

    this.name = 'AuthError';
    this.Result = 'failed';
    this.message = message;
  }

  statusCode(code) {
    this.statusCode = code;
  }
}

function handleErrors(func) {
  return (...args) => {
    try {
      return func(...args);
    } catch (e) {
      return { status: 'failed', error: e };
    }
  };
}

module.export = { ConnectionError, AuthError, handleErrors };
