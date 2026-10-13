import express from "express";
import {
  createOrder,
  getCustomerOrders,
  getOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.route("/").post(createOrder).get(getCustomerOrders);
orderRouter.route("/admin").all(isAdmin).get(getOrders).put(updateOrderStatus);

export default orderRouter;
