import express from 'express';
import products from './data/products.js';
import MongoDb from './config/db.js';
import colors from 'colors';
import productRoutes from './routes/productRoutes.js';

MongoDb();

const app = express();

app.get('/', (req, res, next) => {
  res.send('api is running.');
});

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server connected to port ${PORT}`.yellow.bold);
});
