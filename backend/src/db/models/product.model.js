import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Purchase price is required"],
      min: [0, "Purchase price cannot be negative"],
    },
    images: [
      {
        type: String,
        match: [/^https?:\/\/.+/, "All images must be a valid url"],
      },
    ],
    discount: {
      type: Number,
      min: [0, "Discount must be positive"],
      default: 0,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand is required"],
    },
    isNewProduct: Boolean,
    isFeatured: Boolean,
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

const Product = mongoose.model("Product", productSchema);
export default Product;
