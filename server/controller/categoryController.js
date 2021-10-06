import Category from '../models/categoryModel.js';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';

// @desc   Fetch all categories
// @route  GET /api/categories
// @access Private
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });
  if (categories) {
    return res.json(categories);
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
  const name = req.body;
  const category = await new Category({
    name: 'Sample category name' + Date.now(),
    slug: slugify('Sample category name') + Date.now(),
  });
  const createdCategory = await category.save();
  if (category) {
    res.status(201).json(category);
  } else {
    res.status(404);
    throw new Error('Category create failed.');
  }

  // const { name } = req.body;
  // const category = await new Category({ name }).save();
  // if (category) {
  //   res.json(category);
  //   // res.json(await new Category({ name, slug: slugify(name) }).save());
  // } else {
  //   // console.log(err);
  //   res.status(400).send('Create category failed');
  // }
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
