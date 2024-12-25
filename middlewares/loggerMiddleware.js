const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
};

export default loggerMiddleware;
