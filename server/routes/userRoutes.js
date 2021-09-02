import express from 'express';
const router = express.Router();
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  activateEmail,
  getAccessToken,
  forgotPassword,
  resetPassword,
  googleLogin,
  facebookLogin,
} from '../controller/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(protect, admin, getUsers);
router.post('/register', registerUser);
router.post('/activate', activateEmail);
router.post('/refresh_token', getAccessToken);
router.post('/forgot_password', forgotPassword);
router.post('/reset_password', protect, resetPassword);
router.post('/login', authUser);
router.post('/google_login', googleLogin);
router.post('/facebook_login', facebookLogin);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
