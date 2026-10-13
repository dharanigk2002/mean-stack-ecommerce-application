import Wishlist from "../db/models/wishlist.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addToWishlist = asyncHandler(async function (req, res) {
  const { productId } = req.body;
  const wishlist = await Wishlist.findOneAndUpdate(
    {
      userId: req.user._id,
    },
    {
      $addToSet: { productsId: productId },
      $setOnInsert: { userId: req.user._id },
    },
    {
      returnDocument: "after",
      runValidators: true,
      upsert: true,
    },
  );
  return res
    .status(201)
    .json(new ApiResponse(201, { wishlist }, "Wishlist created successfully"));
});

export const deleteWishlist = asyncHandler(async function (req, res) {
  const { productId } = req.body;
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { productsId: productId } },
    {
      upsert: true,
      returnDocument: "after",
    },
  );
  if (!wishlist) throw new ApiError(404, {}, "Wishlist not found");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Wishlist deleted successfully"));
});

export const getWishlist = asyncHandler(async function (req, res) {
  const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate(
    "productsId",
  );
  return res
    .status(200)
    .json(new ApiResponse(200, { wishlist }, "Wishlist fetched successfully"));
});
