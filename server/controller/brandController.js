import Brand from '../models/brandModel.js';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';

// @desc   Fetch all brands
// @route  GET /api/brands
// @access Private
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({}).sort({ createdAt: -1 });
  if (brands) {
    return res.json(brands);
  }
  res.status(404);
  throw new Error('There are no brands created.');
});

// @desc   Fetch single brand
// @route  GET /api/brands/:slug
// @access Private
const getBrandById = asyncHandler(async (req, res) => {
  // let brand = await brand.findOne({ slug: req.params.slug });
  const brand = await Brand.findById(req.params.id);

  if (brand) {
    return res.json(brand);
  } else {
    res.status(404);
    throw new Error('brand not found.');
  }
});

// @desc   Delete a brand
// @route  DELETE /api/brands/:slug
// @access Private/Admin
const deleteBrand = asyncHandler(async (req, res) => {
  // const brand = await brand.findOneDelete({ slug: req.params.slug });
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (brand) {
    res.json({ message: 'Brand removed.' });
  } else {
    res.status(404);
    throw new Error('Brand delete failed.');
  }
});

// @desc   Create a brand
// @route  POST /api/brands/:slug
// @access Private/Admin
const createBrand = asyncHandler(async (req, res) => {
  const name = req.body;
  const brand = await new Brand({
    name: 'Sample brand name' + Date.now(),
    slug: slugify('Sample brand name') + Date.now(),
  });
  const createdBrand = await brand.save();
  if (createdBrand) {
    res.status(201).json(createdBrand);
  } else {
    res.status(404);
    throw new Error('brand create failed.');
  }
});

// @desc   Update a brand
// @route  PUT /api/brands/:slug
// @access Private/Admin
const updateBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.findOneAndUpdate(
    // {slug: req.params.slug }
    { _id: req.params.id },
    { name, slug: slugify(name) },
    { new: true }
  );

  if (brand) {
    res.status(201).json(brand);
  } else {
    res.status(404);
    throw new Error('Brand update failed.');
  }
});

export { getBrands, getBrandById, deleteBrand, updateBrand, createBrand };
