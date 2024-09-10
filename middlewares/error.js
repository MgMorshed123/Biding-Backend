class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleWare = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";

  err.statusCode = err.statusCode || 500;

  if (err.name === "jsonwebToken") {
    const message = "Json web token is invalid, Try Again";

    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpireError") {
    const message = "Json web token is Expire, Try Again";

    err = new ErrorHandler(message, 400);
  }

  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;

    err = new ErrorHandler(message, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
