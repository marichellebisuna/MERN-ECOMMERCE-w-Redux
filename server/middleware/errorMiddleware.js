import createError from 'http-errors';

const notFound = (req, res, next) => {
  next(createError.NotFound(`Page not found.- ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
};

export { notFound, errorHandler };
