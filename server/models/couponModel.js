import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: 'Name is required.',
      minlength: [2, 'Too short.'],
    },
    expiry: {
      type: Date,
      required: 'Date is required.',
    },
    discount: {
      type: Number,
      required: 'Discount is required.',
      default: 0,
    },
    slug: {
      type: String,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
