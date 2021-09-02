import express from 'express';
const router = express.Router();
import {
  getBrands,
  getBrandById,
  deleteBrand,
  updateBrand,
  createBrand,
} from '../controller/brandController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getBrands).post(protect, admin, createBrand);
router
  .route('/:id')
  .get(getBrandById)
  .delete(protect, admin, deleteBrand)
  .put(protect, admin, updateBrand);

export default router;
