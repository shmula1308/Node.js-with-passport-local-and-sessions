const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

const { ensureGuest } = require("../middleware/auth");

// @desc Register Page
// @route GET /users/register
router.get("/register", ensureGuest, (req, res) => {
  res.render("register", { title: "Register" });
});

// @desc Login Page
// @route GET /users/login
router.get("/login", ensureGuest, (req, res) => {
  res.render("login", { title: "Login" });
});

// @desc Register Page
// @route GET /users/register
router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];
  // Check required fields
  if (!name | !email | !password | !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check password match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Check pass length
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  }
  // Check if user email already exists
  const user = await User.findOne({ email: email });
  if (user) {
    // Render an error if it does
    errors.push({ msg: "Email already exists!" });
    return res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  }

  const userData = {
    name,
    email,
  };

  // Hash the password
  userData.password = await bcrypt.hash(password, 8);

  // Create the new user and save them to database
  const newUser = new User(userData);
  await newUser.save();
  // res.render("login", {
  //   success: "You are now registered and can login!",
  // });
  //req.flash() is called just before the redirect. The success global variable is now populated with  "You are now registerd and can log in!". When "login" page is rendered.the messages partial has access to the global variable success and error which we set up in app.js
  req.flash("success_msg", "You are now registerd and can log in!");
  res.redirect("/users/login");
});

// @desc Logout user
// @route GET /users/logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have been logged out");
  res.redirect("/users/login");
});

// @desc LOGIN User
// @route POST /users/login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true, // if you fail to login the error will be placed in res.locals.error. You have to attach req.flash() with the message. Remember it has to be error not error-message
  })
);

module.exports = router;
