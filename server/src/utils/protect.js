module.export = controller => (req, res, next) => {
  try {
    const { userId } = req;

    if (!userId) {
      throw new Error('Login required');
    }

    controller(req, res, next);
  } catch (err) {
    next(err);
  }
};
