import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import createError from 'http-errors';

const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({});
  res.json(products);
});

const getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  }
  res.status(404);
  //throw next(createError.NotFound('Product not found.'));
  throw new Error('Product not found');
});

export { getProducts, getProductById };
