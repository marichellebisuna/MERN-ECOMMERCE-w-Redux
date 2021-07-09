import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name.'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email.'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password.'],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/myshops/image/upload/v1625542294/store/avatar_eyjxyu.png',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
