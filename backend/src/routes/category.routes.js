import express from "express";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const categoryRouter = express.Router();
categoryRouter.route("/").get(getCategories).post(createCategory);
categoryRouter
  .route("/:id")
  .get(getCategory)
  .all(isAdmin)
  .put(updateCategory)
  .delete(deleteCategory);

export default categoryRouter;
