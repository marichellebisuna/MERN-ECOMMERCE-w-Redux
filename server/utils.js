import jwt from 'jsonwebtoken';
import mg from 'mailgun-js';

export const createActivationToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: '35m',
  });
};
export const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};
export const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

export const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

export const payOrderEmailTemplate = (order) => {
  return `<h1> Thanks for shopping with us<h1>
  <p>
  Hi ${order.user.name}, </p>
  <p>We have finished processing your order.</p>
  <h2>[Order ${order._id}] (${order.createdAt.toString().substring(0, 10)})</h2>
  <table>
  <thead>
  <tr>
  <td><strong>Product</strong></td>
  <td><strong>Quantity</strong></td>
  <td><strong align="right">Price</strong></td>
  </tr>
  </thead>
  <tbody>
  ${order.orderItems
    .map(
      (item) => `
  <tr>
  <td>${item.name}</td>
  <td align="center"> ${item.qty}</td>
  <td style="text-align:right"> $${item.price.toFixed(2)}</td>
  </tr>
  `
    )
    .join('\n')}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Items Price:</td>
  <td align="right">$${order.itemsPrice}</td>
  </tr>
  <tr>
  <td colspan="2">Tax Price:</td>
  <td align="right">$${order.taxPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Shipping Price:</td>
  <td align="right">$${order.shippingPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Total Price:</td>
  <td align="right">$${order.totalPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Payment Method:</td>
  <td align="right">${order.paymentMethod}</td>
  </tr>
  </tfoot>
  </table>
  <h2>Shipping Address</h2>
  <p>
  ${order.user.name} <br/>
  ${order.shippingAddress.address} <br/>
  ${order.shippingAddress.city} ${order.shippingAddress.postalCode}<br/>
  ${order.shippingAddress.country} <br/>
  </p>
  <hr />
  <p>
  Thanks for shopping with us.
  </p>
  `;
};

export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
