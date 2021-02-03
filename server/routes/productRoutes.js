import express from 'express';
const router = express.Router();
import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import createError from 'http-errors';

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const products = await Product.find({});
    res.json(products);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    }
    res.status(404);
    throw next(createError.NotFound('Product not found.'));
  })
);

export default router;
