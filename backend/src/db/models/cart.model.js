import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product id is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    quantity: {
      type: Number,
      min: [1, "Quantity must be a positive number"],
      default: 1,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

cartSchema.index({ userId: 1, productId: 1 }, { uniq: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
