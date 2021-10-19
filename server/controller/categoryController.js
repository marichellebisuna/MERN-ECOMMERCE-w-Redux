import Category from '../models/categoryModel.js';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';

// @desc   Fetch all categories
// @route  GET /api/categories
// @access Private
const getCategories = asyncHandler(async (req, res) => {
  const pageSize = 5;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  const count = await Category.countDocuments({ ...keyword });
  const categories = await Category.find({ ...keyword })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  if (categories) {
    return res.json({ categories, page, pages: Math.ceil(count / pageSize) });
  }
  res.status(404);
  throw new Error('There are no categories created.');
});

// @desc   Fetch single category
// @route  GET /api/categories/:slug
// @access Private
const getCategoryById = asyncHandler(async (req, res) => {
  // let category = await Category.findOne({ slug: req.params.slug });
  const category = await Category.findById(req.params.id);

  if (category) {
    return res.json(category);
  } else {
    res.status(404);
    throw new Error('Category not found.');
  }
});

// @desc   Delete a category
// @route  DELETE /api/categories/:slug
// @access Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  // const category = await Category.findOneDelete({ slug: req.params.slug });
  const category = await Category.findByIdAndDelete(req.params.id);
  if (category) {
    res.json({ message: 'Category removed.' });
  } else {
    res.status(404);
    throw new Error('Category delete failed.');
  }
});

// @desc   Create a category
// @route  POST /api/categories/:slug
// @access Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await new Category({
    name,
    slug: slugify(name),
  });
  const createdCategory = await category.save();
  if (createdCategory) {
    res.status(201).json(createdCategory);
  } else {
    res.status(404);
    throw new Error('Category create failed.');
  }
});

// @desc   Update a category
// @route  PUT /api/categories/:slug
// @access Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.findOneAndUpdate(
    // {slug: req.params.slug }
    { _id: req.params.id },
    { name, slug: slugify(name) },
    { new: true }
  );

  if (category) {
    res.status(201).json(category);
  } else {
    res.status(404);
    throw new Error('Category update failed.');
  }
});

export {
  getCategories,
  getCategoryById,
  deleteCategory,
  updateCategory,
  createCategory,
};
