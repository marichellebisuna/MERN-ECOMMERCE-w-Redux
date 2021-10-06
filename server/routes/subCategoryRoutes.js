import express from 'express';
const router = express.Router();
import {
  getSubCategories,
  getSubCategoryById,
  deleteSubCategory,
  updateSubCategory,
  createSubCategory,
} from '../controller/subCategoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getSubCategories).post(protect, admin, createSubCategory);
router
  .route('/:id')
  .get(getSubCategoryById)
  .delete(protect, admin, deleteSubCategory)
  .put(protect, admin, updateSubCategory);

export default router;
