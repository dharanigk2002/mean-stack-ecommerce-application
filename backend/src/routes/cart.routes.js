import express from "express";

import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter
  .route("/")
  .get(getCart)
  .post(addToCart)
  .delete(removeFromCart)
  .put(updateCartQuantity);

export default cartRouter;
