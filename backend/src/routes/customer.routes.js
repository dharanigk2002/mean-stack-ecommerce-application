import express from "express";
import {
  getFeaturedProducts,
  getNewProducts,
} from "../controllers/customer.controller.js";

const customerRouter = express.Router();

customerRouter.route("/new").get(getNewProducts);
customerRouter.route("/featured").get(getFeaturedProducts);

export default customerRouter;
