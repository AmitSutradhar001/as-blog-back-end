// err.js

const err = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const errMessage = err.message || "Internal Server Error!";
  res.status(statusCode).json({
    success: false,
    message: errMessage,
    statusCode,
  });
};

export default err;
