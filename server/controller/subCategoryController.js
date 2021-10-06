import SubCategory from '../models/subCategoryModel.js';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';

// @desc   Fetch all subcategories
// @route  GET /api/subcategories
// @access Private
const getSubCategories = asyncHandler(async (req, res) => {
  const subCategories = await SubCategory.find({})
    .sort({ createdAt: -1 })
    .populate('parent', 'name');

  if (subCategories) {
    return res.json(subCategories);
  } else {
    res.status(404);
    throw new Error('There are no subcategories created.');
  }
});

// @desc   Fetch single subcategory
// @route  GET /api/subcategories/:id
// @access Private
const getSubCategoryById = asyncHandler(async (req, res) => {
  // let subCategory = await SubCategory.findOne({ slug: req.params.slug });
  const subCategory = await SubCategory.findById(req.params.id).populate(
    'parent',
    'name'
  );

  if (subCategory) {
    return res.json(subCategory);
  } else {
    res.status(404);
    throw new Error('Subcategory not found.');
  }
});

// @desc   Delete a subcategory
// @route  DELETE /api/subcategories/:id
// @access Private/Admin
const deleteSubCategory = asyncHandler(async (req, res) => {
  // const category = await SubCategory.findOneDelete({ slug: req.params.slug });
  const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
  if (subCategory) {
    res.json({ message: 'Subcategory removed.' });
  } else {
    res.status(404);
    throw new Error('Subcategory delete failed.');
  }
});

// @desc   Create a subcategory
// @route  POST /api/subcategories/:id
// @access Private/Admin
const createSubCategory = asyncHandler(async (req, res) => {
  const { name, parent } = req.body;
  const subCategory = await new SubCategory({
    name: 'Sample subcategory name' + Date.now(),
    slug: slugify('Sample subcategory name') + Date.now(),
    parent: await SubCategory.findOne().sort({ field: parent }).limit(1),
  });
  const createdSubCategory = await subCategory.save();
  if (createdSubCategory) {
    res.status(201).json(createdSubCategory);
  } else {
    res.status(404);
    throw new Error('Subcategory create failed.');
  } // FINALLY ITS WORKING!!!!!
});

// @desc   Update a subcategory
// @route  PUT /api/subcategories/:id
// @access Private/Admin
const updateSubCategory = asyncHandler(async (req, res) => {
  const { name, parent } = req.body;
  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: req.params.id },
    { name, parent, slug: slugify(name) },
    { new: true }
  );

  if (subCategory) {
    res.status(201).json(subCategory);
  } else {
    res.status(404);
    throw new Error('Subcategory update failed.');
  }
});

export {
  getSubCategories,
  getSubCategoryById,
  deleteSubCategory,
  updateSubCategory,
  createSubCategory,
};
