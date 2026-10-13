import express from "express";

import {
  addToWishlist,
  deleteWishlist,
  getWishlist,
} from "../controllers/wishlist.controller.js";

const wishlistRouter = express.Router();
wishlistRouter
  .route("/")
  .get(getWishlist)
  .post(addToWishlist)
  .delete(deleteWishlist);

export default wishlistRouter;
