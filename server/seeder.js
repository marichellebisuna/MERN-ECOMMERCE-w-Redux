import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import color from 'colors';

dotenv.config();
connectDb();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    // const sampleProducts = products.map((product) => {
    //   return { ...product, user: adminUser };
    // });
    // await Product.insertMany(sampleProducts);
    console.log('Data imported'.green.inverse);
  } catch (error) {
    console.log(`${error.message}`.red.inverse);
    process.exit(1);
  }
};
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('Data destroyed'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error.message}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
