import Product from "../db/models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createProduct = asyncHandler(async function (req, res) {
  const product = await Product.create({
    ...req.body,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, { product }, "Product added successfulyy"));
});

export const getProducts = asyncHandler(async function (req, res) {
  const { search = "", categoryId, brandId, sortBy, sortOrder } = req.query;

  // Validate pagination parameters
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, Number.parseInt(req.query.pageSize, 10) || 5),
  );

  const query = {
    name: { $regex: search, $options: "i" },
  };

  if (categoryId) query.categoryId = categoryId;
  if (brandId) query.brandId = brandId;

  // Count all matching products before pagination
  const totalProducts = await Product.countDocuments(query);

  const totalPages = Math.ceil(totalProducts / pageSize);

  let productsQuery = Product.find(query);

  // Sorting
  if (sortBy && sortOrder) {
    const normalizedSortOrder = String(sortOrder).toLowerCase();

    const sortDirection =
      normalizedSortOrder === "1" || normalizedSortOrder === "asc"
        ? 1
        : normalizedSortOrder === "-1" || normalizedSortOrder === "desc"
          ? -1
          : null;

    if (sortDirection === null) {
      throw new ApiError(400, {}, "sortOrder must be 1, -1, asc, or desc");
    }

    // Prefer validating sortBy against an allowed-field list
    const allowedSortFields = ["name", "price", "createdAt"];

    if (!allowedSortFields.includes(String(sortBy))) {
      throw new ApiError(400, {}, "Invalid sortBy field");
    }

    productsQuery = productsQuery.sort({
      [sortBy]: sortDirection,
    });
  }

  // Pagination
  productsQuery = productsQuery.skip((page - 1) * pageSize).limit(pageSize);

  const products = await productsQuery;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          currentPage: page,
          pageSize,
          totalProducts,
          totalPages,
          hasPreviousPage: page > 1,
          hasNextPage: page < totalPages,
        },
      },
      "Products fetched successfully",
    ),
  );
});

export const updateProduct = asyncHandler(async function (req, res) {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { returnDocument: "after", runValidators: true },
  );
  if (!product) throw new ApiError(404, {}, "No product found to be updated");
  return res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product updated successfully!"));
});

export const getProduct = asyncHandler(async function (req, res) {
  const product = await Product.findById(req.params.id).populate(
    "categoryId brandId",
  );
  product.categoryId = product.categoryId.name;
  product.brandId = product.brandId.name;
  return res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product fetched successfully!"));
});

export const deleteProduct = asyncHandler(async function (req, res) {
  const product = await Product.deleteOne({ _id: req.params.id });
  if (product.deletedCount === 0)
    return res.status(404).json(new ApiResponse(404, {}, "No product found"));
  return res
    .status(200)
    .json(new ApiResponse(200, { product }, "Product deleted successfully!"));
});
