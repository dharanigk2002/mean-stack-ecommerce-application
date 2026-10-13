import Product from "../db/models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNewProducts = asyncHandler(async function (_, res) {
  const newProducts = await Product.find({
    isNewProduct: true,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { products: newProducts },
        "Products fetched successfully",
      ),
    );
});

export const getFeaturedProducts = asyncHandler(async function (_, res) {
  const newProducts = await Product.find({
    isFeatured: true,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { products: newProducts },
        "Products fetched successfully",
      ),
    );
});
