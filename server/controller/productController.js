import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';

// @desc   Fetch all products
// @route  GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 3;
  const page = Number(req.query.pageNumber) || 1;
  const name = req.query.name || '';
  const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
  // const category = req.query.category || '';
  const order = req.query.order || '';
  // const categoryFilter = category ? { category } : {};
  const min =
    req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
  const max =
    req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
  const rating =
    req.query.rating && Number(req.query.rating) !== 0
      ? Number(req.query.rating)
      : 0;
  const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};
  const sortOrder =
    order === 'lowest'
      ? { price: 1 }
      : order === 'highest'
      ? { price: -1 }
      : order === 'toprated'
      ? { rating: -1 }
      : { _id: -1 };
  const count = await Product.collection.countDocuments({
    ...nameFilter,
    // ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });
  const products = await Product.find({
    ...nameFilter,
    // ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc   Fetch single product
// @route  GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.json(product);
  }
  res.status(404);
  throw new Error('Product not found');
});

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) {
    res.json({ message: 'Product removed' });
  }
  res.status(404);
  throw new Error('Product not found');
});

// @desc   Create a product
// @route  POST /api/products/:id
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const name = req.body;
  const product = new Product({
    name: 'Sample name' + Date.now(),
    slug: slugify('Sample name' + Date.now()),
    price: 0,
    user: req.user._id,
    images: '/images/sample.jpg',
    // brand: '',
    // category: '',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc   Update a product
// @route  PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, brand, category, countInStock, images } =
    req.body;
  // const { images } = req.file.originalname;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.images = images;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found.');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.reviews.find((x) => x.name === req.user.name)) {
      return res
        .status(400)
        .send({ message: 'You already submitted a review.' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    const updatedProduct = await product.save();
    res.status(201).json({
      message: 'Review added',
      review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
    });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  // rating:-1 means ascending
  res.json(products);
});

//a new way of advance search filters
//component/SearchBox.js [const name]

const handleQuery = async (req, res, query) => {
  const products = await Product.find({});
};
const searchFilters = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (query) {
    console.log('query', query);
    await handleQuery(req, res, query);
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  searchFilters,
};
