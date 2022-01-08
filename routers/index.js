const express = require("express");

const router = express.Router();
const { ensureGuest, ensureAuth } = require("../middleware/auth");
// @desc Landing-page
// @route GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("welcome", { title: "Welcome Page" });
});

// @desc Dashboard
// @route GET /
router.get("/dashboard", ensureAuth, (req, res) => {
  res.render("Dashboard", { layout: "dashboard" });
});

module.exports = router;
