const path = require("path");

const exphbs = require("express-handlebars");
const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");

const session = require("express-session");
const mongoose = require("mongoose");
const connectDB = require("./config/mongoose");
const MongoStore = require("connect-mongo");
const { inputValue } = require("./helpers/hbs");

//Load config
dotenv.config({ path: "./config/.env" });

//Passport config
require("./config/passport")(passport); //this inform the route /auth what strategy we are using. I tested this, you can put this line anywhere, even unde app.use(passport.initialize()) and it still works

// Mongoose connects to database
connectDB();

const app = express();
const PORT = process.env.PORT;

// Body parser
app.use(express.json()); // if you send JSON from the front end, this will parse it and populate the req.body
app.use(express.urlencoded({ extended: true })); // if you send javascript object,like in this case from the form, this line is what populates the req.body object

// Public folder
app.use(express.static(path.join(__dirname, "public")));

// View Engine Setup
app.engine(".hbs", exphbs.engine({ helpers: { inputValue }, extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

const sessionStore = MongoStore.create({
  client: mongoose.connection.getClient(), // interesting!! You can get your current connection from importing the mongoose package
  collection: "sessions",
  ttl: 14 * 24 * 60 * 60, //time to live?
  autoRemove: "native",
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false, //we don't want to save the session if nothing is modified
    saveUninitialized: false, //dont create a session until something is stored
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // equals 1 day
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routers/index"));
app.use("/users", require("./routers/users"));

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  }
  console.log(`Server is up and running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
