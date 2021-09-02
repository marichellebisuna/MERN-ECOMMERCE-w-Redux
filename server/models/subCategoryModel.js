import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Name is required.',
      minlength: [3, 'Too short.'],
      minlength: [32, 'Too long.'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    parent: {
      type: ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true }
);

const Subcategory = mongoose.model('Subcategory', subCategorySchema);

export default Subcategory;
