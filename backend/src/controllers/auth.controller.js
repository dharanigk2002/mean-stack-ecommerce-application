import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../db/models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async function (req, res) {
  const { name, email, password } = req.body;
  if (!email || !password || !name)
    throw new ApiError(400, {}, "Please provide name, email and password");
  const isExistingUser = await User.findOne({ email });
  if (isExistingUser)
    throw new ApiError(409, {}, "Please select different email address");
  const user = await User.create({
    name,
    email,
    password,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, { user }, "User registered successfully"));
});

export const loginUser = asyncHandler(async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError(400, {}, "Please provide email and password");
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, { user }, "Unauthorized");
  if (!(await user.isPasswordMatching(password)))
    throw new ApiError(401, {}, "Unauthorized");
  const token = User.generateJwtToken({ id: user._id });

  return res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: process.env.ENVIRONMENT !== "development",
    })
    .json(new ApiResponse(200, { user }, "User logged in successfully"));
});

export const getUser = asyncHandler(async function (req, res) {
  return res.status(200).json(new ApiResponse(200, { user: req.user }, ""));
});

export const logout = asyncHandler(async function (_, res) {
  return res.status(204).clearCookie("token").end();
});
