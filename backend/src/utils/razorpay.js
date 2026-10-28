const Razorpay = require("razorpay")


const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // this is public key id
  key_secret: process.env.RAZORPAY_KEY_SECRET, //this is very crucial secret_key for razorpay
});


//docs==> https://razorpay.com/docs/payments/server-integration/nodejs/integration-steps
module.exports = instance