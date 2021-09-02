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
    image: {
      type: Array,
      default:
        'https://res.cloudinary.com/myshops/image/upload/v1627277588/store/avatar-icon_f3hdnk.png',
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
