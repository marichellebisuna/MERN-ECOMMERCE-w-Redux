import asyncHandler from 'express-async-handler';
import { createActivationToken, validateEmail } from '../utils.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import sendMail from '../sendMail.js';

// @desc   Auth user & get token
// @route  POST api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compareSync(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password.');
  }
});

// @desc   Register a new user
// @route  POST api/users
// @access Public

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please complete the registration.');
    }

    if (!validateEmail(email)) {
      res.status(400);
      throw new Error('Invalid email.');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be atleast 6 characters.');
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = {
      name,
      email,
      password: hashPassword,
    };

    const activation_token = createActivationToken(newUser);

    console.log(activation_token);
    const url = `${process.env.CLIENT_URL}/user/activate/${activation_token}`;
    sendMail(email, url, 'Verify your email address.');
    res.json({ msg: 'Register success! Please activate your email to start.' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// @desc   Activate email
// @route  POST api/activation
// @access Public
const activateEmail = asyncHandler(async (req, res) => {
  // const { activation_token } = req.body;
  // const user = jwt.verify(
  //   activation_token,
  //   process.env.ACTIVATION_TOKEN_SECRET
  // );

  // const { name, email, password } = user;

  // const check = await User.findOne({ email });

  // if (!check) {
  //   const newUser = new User({
  //     _id: user._id,
  //     name,
  //     email,
  //     password,
  //     // isAdmin: user.isAdmin,
  //     //token: createActivationToken(newUser),
  //   });
  //   await newUser.save();
  //   res.status(201).json({
  //     msg: 'Account has been activated!',
  //     // _id: user._id,
  //     name,
  //     email,
  //     // isAdmin: user.isAdmin,
  //     password,
  //     // token: createActivationToken(newUser),
  //   });
  // } else {
  //   res.status(400);
  //   throw new Error('"This email already exists."');
  // }
  // // try {
  // const { activation_token } = req.body;
  // const user = jwt.verify(
  //   activation_token,
  //   process.env.ACTIVATION_TOKEN_SECRET
  // );

  //const { name, email, password } = user;
  //console.log(activation_token);
  // const check = await Users.findOne({ email });
  // if (check)
  //   return res.status(400).json({ msg: 'This email already exists.' });

  // const newUser = new Users({
  //   name,
  //   email,
  //   password,
  // });

  // await newUser.save();

  //res.json({ msg: 'Account has been activated!' });
  res.json({ msg: activation_token });
  // } catch (err) {
  //   return res.status(500).json({ msg: err.message });
  // }
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
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
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
};
