import { asyncHandler } from "../utils/asyncHandler.js";

export const cors = asyncHandler(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.CORS_ALLOWED_ORIGINS,
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    process.env.CORS_ALLOWED_HEADERS,
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    process.env.CORS_ALLOWED_METHODS,
  );
  res.setHeader(
    "Access-Control-Allow-Credentials",
    process.env.CORS_ALLOW_CREDENTIALS,
  );
  res.removeHeader("x-powered-by");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});
