import asyncHandler from 'express-async-handler';
import {
  createActivationToken,
  createAccessToken,
  createRefreshToken,
  validateEmail,
  generateToken,
} from '../utils.js';
import User from '../models/userModel.js';

import bcrypt from 'bcryptjs';
import sendMail from '../sendMail.js';
import jwt from 'jsonwebtoken';

// @desc   Auth user & get token
// @route  POST api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  // const { email, password } = req.body;

  // const user = await User.findOne({ email });
  // const isMatch = await bcrypt.compare(password, user.password);
  // if (user && isMatch) {
  //   const refresh_token = createRefreshToken({ id: user._id });
  //   res.cookie('refreshtoken', refresh_token, {
  //     httpOnly: true,
  //     path: '/api/users/refresh_token',
  //     maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  //   });

  //   res.json({ name: user.name });
  // } else {
  //   res.status(400);
  //   throw new Error('Invalid email or password.');
  // }
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc   Auth user & get token
// @route  POST api/users/google_login
// @access Public
const googleLogin = asyncHandler(async (req, res) => {
  const { tokenId } = req.body;

  const verify = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.MAILING_SERVICE_CLIENT_ID,
  });

  const { email_verified, email, name, picture } = verify.payload;

  const password = email + process.env.GOOGLE_SECRET;

  const passwordHash = await bcrypt.hash(password, 12);

  if (!email_verified)
    return res.status(400).json({ msg: 'Email verification failed.' });

  const user = await User.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: 'Password is incorrect.' });

    const refresh_token = createRefreshToken({ id: user._id });
    res.cookie('refreshtoken', refresh_token, {
      httpOnly: true,
      path: '/api/user/refresh_token',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ msg: 'Login success!' });
  } else {
    const newUser = new Users({
      name,
      email,
      password: passwordHash,
      avatar: picture,
    });

    await newUser.save();

    const refresh_token = createRefreshToken({ id: newUser._id });
    res.cookie('refreshtoken', refresh_token, {
      httpOnly: true,
      path: '/api/user/refresh_token',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ msg: 'Login success!' });
  }
});

// @desc   Auth user & get token
// @route  POST api/users/facebook_login
// @access Public
const facebookLogin = asyncHandler(async (req, res) => {
  const { accessToken, userID } = req.body;

  const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

  const data = await fetch(URL)
    .then((res) => res.json())
    .then((res) => {
      return res;
    });

  const { email, name, picture } = data;

  const password = email + process.env.FACEBOOK_SECRET;

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: 'Password is incorrect.' });

    const refresh_token = createRefreshToken({ id: user._id });
    res.cookie('refreshtoken', refresh_token, {
      httpOnly: true,
      path: '/api/user/refresh_token',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ msg: 'Login success!' });
  } else {
    const newUser = new User({
      name,
      email,
      password: passwordHash,
      avatar: picture.data.url,
    });

    await newUser.save();

    const refresh_token = createRefreshToken({ id: newUser._id });
    res.cookie('refreshtoken', refresh_token, {
      httpOnly: true,
      path: '/api/user/refresh_token',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ msg: 'Login success!' });
  }
});

// @desc   Auth user & get access token
// @route  POST api/users/refresh_token
// @access Private
const getAccessToken = (req, res) => {
  const rf_token = req.cookies.refreshtoken;
  if (rf_token) {
    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ msg: 'Please login now!' });

      const access_token = createAccessToken({ id: user.id });
      console.log(access_token);
      res.json({ access_token });
    });
  } else {
    return res.status(400).json({ msg: 'Please login now!' });
  }
};

// @desc   Register a new user
// @route  POST api/users/register
// @access Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please complete the registration.');
    }

    if (!validateEmail(email)) {
      res.status(400);
      throw new Error('Invalid email.');
    }
    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be atleast 6 characters.');
    }
    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = {
      name,
      email,
      password: passwordHash,
    };

    const activation_token = createActivationToken(newUser);
    const url = `${process.env.CLIENT_URL}/user/activate/${activation_token}`;
    sendMail(email, url, 'Verify your email address.');
    res.json({ msg: 'Register success! Please activate your email to start.' });
  } else {
    res.status(400);
    throw new Error('This email already exists');
  }
});

// @desc   Activate email
// @route  POST api/users/activate
// @access Public
const activateEmail = asyncHandler(async (req, res) => {
  const { activation_token } = req.body;
  const user = jwt.verify(
    activation_token,
    process.env.ACTIVATION_TOKEN_SECRET
  );

  const { name, email, password } = user;

  const check = await User.findOne({ email });
  if (!check) {
    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();
    res.json({ msg: 'Account has been activated!' });
    res.json({ msg: activation_token });
  } else {
    return res.status(400).json({ msg: 'This email already exists.' });
  }
});

// @desc   Forgot password
// @route  POST api/users/forgot_password
// @access Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const access_token = createAccessToken({ id: user._id });
    const url = `${process.env.CLIENT_URL}/api/users/reset/${access_token}`;

    sendMail(email, url, 'Reset your password');
    res.json({
      msg: 'Re-send the password, please check your email.',
      access_token,
    });
  } else {
    return res.status(400).json({ msg: 'This email does not exist.' });
  }
});

// @desc   Reset password
// @route  POST api/users/reset_password
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  console.log(password);
  const passwordHash = await bcrypt.hash(password, 12);

  await User.findOneAndUpdate(
    { _id: req.user.id },
    {
      password: passwordHash,
    }
  );

  res.json({ msg: 'Password successfully changed!' });
});

// @desc   GET user profile
// @route  GET api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      image: user.image,
    });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

// @desc   Update user profile
// @route  PUT api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.image = req.body.image || user.image;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      image: updatedUser.image,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

// @desc   GET all users
// @route  GET api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc   Delete user
// @route  DEL api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }

  // await User.findByIdAndDelete(req.params.id)
  // res.json({ message: 'User removed' });
});

// @desc   GET user by ID
// @route  GET api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc   Update user
// @route  PUT api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  // const {email, name, isAdmin}=req.body
  // await User.findByIdAndUpdate({_id:req.params.id}, {name, email, isAdmin})
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin || user.isAdmin;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

export {
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
  facebookLogin,
  googleLogin,
};
