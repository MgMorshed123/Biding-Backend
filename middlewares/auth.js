import jwt from "jsonwebtoken";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "./error.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token;

  // Log token to check if it's being received
  console.log("Token from cookies:", token);
  console.log("date", Date.now());
  if (!token) {
    return next(new ErrorHandler("User not authenticated.", 400));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log("Decoded token:", decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    // Log the exact error to troubleshoot
    console.error("JWT verification error:", error.message);
    return next(new ErrorHandler("Token is invalid or has expired.", 401));
  }
});

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resouce.`,
          403
        )
      );
    }
    next();
  };
};
