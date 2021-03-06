import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  getCategories,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  getTopProducts,
  searchFilters,
} from '../controller/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/categories').get(getCategories);
router.route('/:id/reviews').post(protect, createProductReview);
router.get('/top', getTopProducts);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

// another way for advance search filter
router.post('/search/filters', searchFilters);

export default router;
