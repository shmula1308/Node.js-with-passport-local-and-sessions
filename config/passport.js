const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = (passport) => {
  const verifyCallback = async (email, password, done) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      return done(null, false); // done() function takes an error as the first argument and boolean as second. Here we're saying, no there is no error (null), but also there is no user(false). Passport probably returns Unauthorized 401 status code
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return done(null, user); // when we pass this to the passport it's going to let us into the route
    } else {
      return done(null, false);
    }
  };

  const strategy = new LocalStrategy({ usernameField: "email" }, verifyCallback);

  passport.use(strategy);

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((userId, done) => {
    User.findById(userId)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  });
};
