import express from "express";

import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const productRouter = express.Router();
productRouter.use(isAuthenticated);

productRouter.route("/").post(createProduct).get(getProducts);
productRouter
  .route("/:id")
  .get(getProduct)
  .all(isAdmin)
  .patch(updateProduct)
  .delete(deleteProduct);

export default productRouter;
