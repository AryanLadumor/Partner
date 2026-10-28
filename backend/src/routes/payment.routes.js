const express = require("express");
const { userAuth } = require("../middleware/auth");
const router = express.Router();
const razorpay = require("../utils/razorpay");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");


const Payment = require("../models/Payment");
const User = require("../models/User");

router.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    //creating a order docs==> https://razorpay.com/docs/api/orders/create  OR  https://github.com/razorpay/razorpay-node/blob/master/documents/order.md
    const order = await razorpay.orders.create({
      amount: membershipAmount[membershipType], //in paisa and those 1st 3 field are imp also we should not write the amt digits here it can be alter by MIM attacks
      currency: "INR",
      receipt: "receipt#1",
      notes: { // in notes we store our imp order details
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    }); //this will give us orderId and details of the order and will save it in database

    //saving details in database
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      amount_due: order.amount_due,
      amount_paid: order.amount_paid,
      attempts: order.attempts,
      receipt: order.receipt,
      status: order.status,
      notes: order.notes,
    });

    const savedPayment = await payment.save(); //the response needs to get converted into JSON

    //sending response to database
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID}); //passing keyId so we can use it on payment dialogbox
  } catch (error) {
    res.status(500).json({ err: error.message }); 
    console.log(error);
  }
});

router.post("/payment/webhook", async (req, res) => {
  //we have created webhook in razorpay(https://patner.xyz/api/payment/webhook)
  //when ever the payment is failed or success this webhook will be called docs ==> (https://razorpay.com/docs/webhooks/validate-test)
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,  
    );

    if (!isWebhookValid) {
      return res.status(400).json({ msg: "Webhook signature isinvalid" });
    }

    const paymentDetails = req.body.payload.payment.entity; 

    // update my payment status in DB
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    // update the user as premium
    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    //return sucess response to razorpay
    res.status(200).json({ msg: "Webhook Recived Successfully" });
  } catch (error) {
    console.dir(error);
  }
});

router.get("/premium/verify", userAuth, async (req, res) => {
  try {
    const user = req.user.toJSON();
    if (user.isPremium) {
      return res.json({ isPremium: true });
    }
    return res.json({ isPremium: false });
  } catch (error) {}
});

module.exports = router;
