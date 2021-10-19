import Coupon from '../models/CouponModel.js';
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';

// @desc   Fetch all Coupons
// @route  GET /api/Coupons
// @access Private
const getCoupons = asyncHandler(async (req, res) => {
  const pageSize = 5;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  const count = await Coupon.countDocuments({ ...keyword });
  const coupons = await Coupon.find({ ...keyword })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  if (coupons) {
    return res.json({ coupons, page, pages: Math.ceil(count / pageSize) });
  }
  res.status(404);
  throw new Error('There are no coupons created.');
});

// @desc   Fetch all Coupons by Search
// @route  POST /api/Coupons
// @access Private
const getCouponsBySearch = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  // const { page } = req.body;
  // const currentPage = page || 1;
  // const perPage = 3;

  const coupons = await Coupon.find({ ...keyword });
  // .skip((currentPage - 1) * perPage)
  // .sort([[' createdAt', 'desc']])
  // .limit(perPage);
  if (coupons) {
    return res.json(coupons);
  }
  res.status(404);
  throw new Error('There are no Coupons created.');
});

// @desc   Fetch single Coupon
// @route  GET /api/Coupons/:slug
// @access Private
const getCouponById = asyncHandler(async (req, res) => {
  // let Coupon = await Coupon.findOne({ slug: req.params.slug });
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    return res.json(coupon);
  } else {
    res.status(404);
    throw new Error('Coupon not found.');
  }
});

// @desc   Delete a Coupon
// @route  DELETE /api/Coupons/:slug
// @access Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  // const Coupon = await Coupon.findOneDelete({ slug: req.params.slug });
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (coupon) {
    res.json({ message: 'Coupon removed.' });
  } else {
    res.status(404);
    throw new Error('Coupon delete failed.');
  }
});

// @desc   Create a Coupon
// @route  POST /api/Coupons/:slug
// @access Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const { name, expiry, discount } = req.body;
  const coupon = await new Coupon({
    name,
    expiry,
    discount,
    slug: slugify(name),
  });
  const createdCoupon = await coupon.save();
  if (createdCoupon) {
    res.status(201).json(createdCoupon);
  } else {
    res.status(404);
    throw new Error('Coupon create failed.');
  }
});

// @desc   Update a Coupon
// @route  PUT /api/Coupons/:slug
// @access Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const { name, expiry, discount } = req.body;
  const coupon = await Coupon.findOneAndUpdate(
    // {slug: req.params.slug }
    { _id: req.params.id },
    { name, expiry, discount, slug: slugify(name) },
    { new: true }
  );

  if (coupon) {
    res.status(201).json(coupon);
  } else {
    res.status(404);
    throw new Error('Coupon update failed.');
  }
});

export {
  getCoupons,
  getCouponById,
  deleteCoupon,
  updateCoupon,
  createCoupon,
  getCouponsBySearch,
};
