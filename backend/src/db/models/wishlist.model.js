import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    productsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: [true, "User id already exists"],
      required: [true, "User id is required"],
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

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
