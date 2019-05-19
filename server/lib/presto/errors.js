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
    this.statusCode = 200;
  }

  statusCode(code) {
    this.statusCode = code;
  }
}

class ParseError extends Error {
  constructor(selector) {
    super(`Could not find element: ${selector}`);

    this.name = 'ParseError';
  }

  statusCode(selector) {
    this.selector = selector;
  }
}

class PrestoError extends Error {
  constructor(message) {
    super(message);

    this.name = 'PrestoError';
  }

  statusCode(selector) {
    this.selector = selector;
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

module.exports = { ConnectionError, AuthError, ParseError, PrestoError, handleErrors };
