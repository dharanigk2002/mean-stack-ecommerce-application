import express from "express";
import {
  getUser,
  loginUser,
  logout,
  registerUser,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/me").get(isAuthenticated, getUser);
authRouter.route("/logout").get(isAuthenticated, logout);

export default authRouter;
