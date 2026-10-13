import Cart from "../db/models/cart.model.js";
import Order from "../db/models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async function (req, res) {
  const userId = req.user._id;
  const { shippingAddress, paymentType } = req.body;

  const cart = await Cart.find({ userId }).populate("productId");

  if (cart.length === 0) throw new ApiError(400, {}, "Your cart is empty");

  const orderItems = cart.map((cartItem) => {
    const product = cartItem.productId;
    if (!product)
      throw new ApiError(404, {}, "A product in your cart no longer exists");
    const discount = product.discount ?? 0;

    const price = Math.round(product.price * (1 - discount / 100));

    return {
      productId: product._id,
      name: product.name,
      price,
      quantity: cartItem.quantity,
    };
  });
  const totalAmount = orderItems.reduce(
    (acc, order) => acc + order.price * order.quantity,
    0,
  );
  const order = await Order.create({
    userId,
    items: orderItems,
    shippingAddress,
    totalAmount,
    paymentType,
  });
  await Cart.deleteMany({ userId });
  return res
    .status(201)
    .json(new ApiResponse(201, { order }, "Order placed successfully"));
});

export const getCustomerOrders = asyncHandler(async function (req, res) {
  const userId = req.user._id;
  const orders = await Order.find({ userId }).populate("items.productId");
  return res
    .status(200)
    .json(new ApiResponse(200, { orders }, "Orders fetched successfully"));
});

export const getOrders = asyncHandler(async function (req, res) {
  const { page: currentPage = 1, pageSize = 4 } = req.query;
  console.log(currentPage);
  const totalOrders = await Order.countDocuments();
  const totalPages = Math.ceil(totalOrders / pageSize);
  const orders = await Order.find()
    .populate("items.productId")
    .limit(pageSize)
    .skip((currentPage - 1) * pageSize);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        pagination: {
          currentPage,
          pageSize,
          hasPreviousPage: currentPage > 1,
          hasNextPage: currentPage < totalPages,
          totalPages,
          totalProducts: totalOrders,
        },
      },
      "Orders fetched successfully!",
    ),
  );
});

export const updateOrderStatus = asyncHandler(async function (req, res) {
  const { orderId, status } = req.body;
  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      status,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
  if (!order) throw new ApiError(404, null, "No such order found");
  return res
    .status(200)
    .json(new ApiResponse(200, { order }, "Order updated successfully"));
});
