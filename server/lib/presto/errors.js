class ConnectionError extends Error {
  constructor(message) {
    super(message);

    this.name = 'ConnectionError';
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

module.export = { ConnectionError, addErrorHandling };
