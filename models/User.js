const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      // unique: true,
      // dropDups: true,
      lowercase: true,
      // validate(value) {
      //   if (!validator.isEmail(value)) {
      //     throw new Error("Invalid email");
      //   }
      // },
    },
    password: {
      type: String,
      required: true,
      // minlength: 6,
      // validate(value) {
      //   if (value.toLowerCase().includes("password")) {
      //     throw new Error("Email cannot contain 'password'");
      //   }
      // },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
