const express = require("express");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail.js");
const router = express.Router();

const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validations.js");
const User = require("../models/User.js");

//API -> [POST /signup] => Add user to DB
router.post("/signup", async (req, res) => {
  try {
    //1. validation of data
    validateSignUpData(req);

    //Encrypt of password and store to DB
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      about,
      gender,
      skills,
      photoURL,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      emailId,
      password: passwordHash,
      photoURL: photoURL,
      ...(lastName && { lastName }),
      ...(age && { age }),
      ...(about && { about }),
      ...(gender && { gender }),
      ...(skills && { skills }),
      ...(photoURL && { photoURL }),
    });
    //Adding user to db
    const result = await user.save(); // All db functions will return promise
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 3600 * 1000),
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    }); // expires after 1 hour


    const emailObject = {
      subject: "User Regsiteration",
      text: "New User Registered",
      msgHtml: `<div style="font-family:Arial,sans-serif;padding:20px;background:#f8fafc;border-radius:10px;color:#1e293b;">
                          <h2 style="color:#4f46e5;">🎉 New User Registered!</h2>
                          <p>Someone just registered in your application.</p>
                          <hr style="border:0;border-top:1px solid #e2e8f0;">

                          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                          <p><strong>Email:</strong> ${emailId}</p>

                          <p><strong>Profile Photo:</strong></p>
                          <img src="${photoURL}" width="70" height="70"
                              style="border-radius:50%;object-fit:cover;">

                          <hr style="border:0;border-top:1px solid #e2e8f0;">
                          <p style="font-size:12px;color:#64748b;">
                            Automated notification from your application.
                          </p>
                </div>`
    };

    await sendEmail.run(emailObject);  //Sending Email

    res.json({ msg: "registered Succefull", user: result });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//API -> [POST /login] => To Authenticate user
router.post("/login", async (req, res) => {
  try {
    //validations
    validateLoginData(req);

    //Finding If user exits with email
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    //decryption by using helper function in User Schema
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //Getting JWT by helper Funtion
      const token = await user.getJWT();

      //passing token to the cookies in the user browser
      res.cookie("token", token, {
        expires: new Date(Date.now() + 3600 * 1000),
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      }); // expires after 1 hour

      //logging user
      res.json({ msg: "login Succefull", user });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//API -> [POST /logout] => To Logout user
router.post("/logout", (req, res) => {
  try {
    res
      .cookie("token", null, { expires: new Date(Date.now()) })
      .json({ msg: "Logged Out Successful" });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
