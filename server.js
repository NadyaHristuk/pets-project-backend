const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const morgan = require("morgan");

require("dotenv").config();

const swaggerDoc = require("./src/modules/swagger/swaggerDoc");
const routes = require("./src/routes/routes");
const app = express();

// Passport Config
require("./src/modules/passport/passport")(passport);

// Get url to server MongoDB
const dbUrl = process.env.MONGO_CONNECTION_URL;

// Connect to MongoDB
mongoose
  .connect(dbUrl)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Logger - see connection in/out
app.use(morgan("dev"));
// Express json parse
app.use(express.json());
// Express static
app.use("/data", express.static("data"));

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: "secret cat",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

swaggerDoc(app);

// Connecting All API Routes
app.use("/", routes);

// Get PORT for Express App
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
