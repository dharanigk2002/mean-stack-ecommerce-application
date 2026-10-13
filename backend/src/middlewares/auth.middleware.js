import User from "../db/models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isAuthenticated = asyncHandler(async function (req, _, next) {
  const token = req.cookies.token;
  if (!token) throw new ApiError(403, {}, "Invalid token");
  const { id } = await User.verifyToken(token);
  const user = await User.findById(id);
  if (!user) throw new ApiError(401, {}, "Unauthorized");
  req.user = user;
  next();
});

export const isAdmin = asyncHandler(async function (req, _, next) {
  const user = req.user;
  if (!user) throw new ApiError(401, {}, "Unauthorized");
  if (!user.isAdmin) throw new ApiError(403, {}, "Cannot perform this action");
  return next();
});
