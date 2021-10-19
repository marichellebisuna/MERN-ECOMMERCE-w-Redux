import express from 'express';
const router = express.Router();
import {
  getCoupons,
  getCouponById,
  deleteCoupon,
  updateCoupon,
  createCoupon,
  getCouponsBySearch,
} from '../controller/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router
  .route('/')
  .get(getCoupons)
  .post(protect, admin, createCoupon)
  .post(protect, admin, getCouponsBySearch);

router
  .route('/:id')
  .get(getCouponById)
  .delete(protect, admin, deleteCoupon)
  .put(protect, admin, updateCoupon);

export default router;
