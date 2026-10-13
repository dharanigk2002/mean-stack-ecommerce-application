import express from "express";
import {
  addBrand,
  deleteBrand,
  getBrand,
  getBrands,
  updateBrand,
} from "../controllers/brand.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const brandRouter = express.Router();
brandRouter.route("/").get(getBrands).post(isAdmin, addBrand);
brandRouter
  .route("/:id")
  .get(getBrand)
  .all(isAdmin)
  .put(updateBrand)
  .delete(deleteBrand);

export default brandRouter;
