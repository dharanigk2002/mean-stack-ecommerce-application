import Category from "../db/models/category.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCategory = asyncHandler(async function (req, res) {
  const { name } = req.body;
  if (!name) throw new ApiError(400, {}, "Category name is required");
  const category = await Category.create({
    name,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, { category }, "Category created successfully"));
});

export const updateCategory = asyncHandler(async function (req, res) {
  const { name } = req.body;
  if (!name) throw new ApiError(400, {}, "Category name is required");
  const { id } = req.params;
  const category = await Category.findByIdAndUpdate(
    id,
    {
      name,
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
  return res
    .status(200)
    .json(new ApiResponse(200, { category }, "Category updated successfully"));
});

export const deleteCategory = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const category = await Category.deleteOne({ _id: id });
  if (category.deletedCount === 0)
    throw new ApiError(404, {}, "No such category exists");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

export const getCategories = asyncHandler(async function (_, res) {
  const categories = await Category.find();
  return res
    .status(200)
    .json(
      new ApiResponse(200, { categories }, "Categories fetched successfully"),
    );
});

export const getCategory = asyncHandler(async function (req, res) {
  const category = await Category.findById(req.params.id);

  if (!category) throw new ApiError(404, {}, "No such category found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, { category }, "Categories fetched successfully"),
    );
});
