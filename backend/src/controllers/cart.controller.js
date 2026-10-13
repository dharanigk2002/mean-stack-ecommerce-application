import Cart from "../db/models/cart.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addToCart = asyncHandler(async function (req, res) {
  const { productId, quantity = 1 } = req.body;
  if (isNaN(quantity) || quantity < 1) {
    throw new ApiError(400, {}, "Please enter a positive quantity number");
  }
  const isExisting = await Cart.findOne({ productId });
  if (isExisting)
    throw new ApiError(
      409,
      null,
      "Cannot create a new cart with existing item",
    );

  const cart = await Cart.create({
    productId,
    userId: req.user._id,
    quantity,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { cart }, "Item added to cart"));
});

export const updateCartQuantity = asyncHandler(async function (req, res) {
  const { productId, quantity = 1 } = req.body;

  if (isNaN(quantity))
    throw new ApiError(400, null, "Invalid quantity value provided");

  if (quantity < 1) {
    await Cart.deleteOne({ productId, userId: req.user._id });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Item removed because quantity reached zero",
        ),
      );
  }

  const cart = await Cart.findOneAndUpdate(
    { productId, userId: req.user._id },
    { $set: { quantity } },
    { returnDocument: "after", runValidators: true },
  );

  if (!cart) throw new ApiError(404, null, "Product not found in user's cart");

  return res
    .status(200)
    .json(new ApiResponse(200, { cart }, "Cart quantity updated successfully"));
});

export const removeFromCart = asyncHandler(async function (req, res) {
  const { productId } = req.body;
  const cart = await Cart.deleteOne({
    productId,
    userId: req.user._id,
  });
  if (cart.deletedCount === 0)
    throw new ApiError(404, {}, "No such product found inside cart");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product removed from cart successfully"));
});

export const getCart = asyncHandler(async function (req, res) {
  const userId = req.user._id;
  const cart = await Cart.find({ userId }).populate("productId");
  if (!cart) throw new ApiError(404, {}, "No cart found");
  return res
    .status(200)
    .json(new ApiResponse(200, { cart }, "Cart fetched successfully"));
});
