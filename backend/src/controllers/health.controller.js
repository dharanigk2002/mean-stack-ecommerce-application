import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const healthCheck = asyncHandler((_, res) =>
  res.status(200).json(new ApiResponse(200, {}, "Server is up and running")),
);
