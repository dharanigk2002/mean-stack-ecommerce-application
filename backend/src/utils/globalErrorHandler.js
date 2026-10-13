import mongoose, { MongooseError } from "mongoose";
import { ApiError } from "./ApiError.js";
import jwt from "jsonwebtoken";

const { JsonWebTokenError, TokenExpiredError } = jwt;

export function globalErrorHandler(err, _, res, _1) {
  console.log("[ERROR]", err.message);
  console.log(err);
  if (err instanceof MongooseError)
    return res.status(400).json(new ApiError(400, {}, err.message));
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((error) => ({
      path: error.path,
      message: error.message,
    }));
    return res.status(400).json(new ApiError(400, errors, "Validation falied"));
  }
  if (err instanceof ApiError) return res.status(err.statusCode).json(err);
  if (err instanceof JsonWebTokenError) {
    return res.status(400).json(new ApiError(400, {}, "Invalid token"));
  }
  if (err instanceof TokenExpiredError) {
    return res
      .status(400)
      .json(new ApiError(400, {}, "Please login to continue"));
  }
  return res.status(500).json(new ApiError(500, {}, "Something went wrong"));
}
