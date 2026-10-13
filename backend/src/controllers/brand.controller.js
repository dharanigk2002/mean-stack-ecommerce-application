import Brand from "../db/models/brand.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getBrands = asyncHandler(async function (_, res) {
  const brands = await Brand.find();
  return res
    .status(200)
    .json(new ApiResponse(200, { brands }, "Brands fetched successfully"));
});

export const getBrand = asyncHandler(async function (req, res) {
  const brand = await Brand.findById(req.params.id);
  if (!brand) throw new ApiError(404, {}, "No such brand found");
  return res
    .status(200)
    .json(new ApiResponse(200, { brand }, "Brand fetched successfully"));
});

export const addBrand = asyncHandler(async function (req, res) {
  const { name } = req.body;
  if (!name) throw new ApiError(400, {}, "Brand name is required");
  const brand = await Brand.create({
    name,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, { brand }, "Brand created successfully"));
});

export const updateBrand = asyncHandler(async function (req, res) {
  const { name } = req.body;
  if (!name) throw new ApiError(400, {}, "Brand name is required");
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    { name },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { brand }, "Brand updated successfully"));
});

export const deleteBrand = asyncHandler(async function (req, res) {
  const brand = await Brand.deleteOne({ _id: req.params.id });
  if (brand.deletedCount === 0)
    throw new ApiError(404, {}, "No such brand found");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Brand deleted successfully"));
});
