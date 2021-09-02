import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Unathorized, invalid token.');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Unauthorized. no token found.');
  }

  // try {
  //   const token = req.header('Authorization');
  //   if (!token)
  //     return res.status(400).json({ msg: 'Unauthorized. no token found.' });

  //   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  //     if (err)
  //       return res.status(400).json({ msg: 'Unauthorized. no token found.' });

  //     req.user = user;
  //     next();
  //   });
  // } catch (err) {
  //   return res.status(500).json({ msg: err.message });
  // }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
