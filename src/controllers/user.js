const jwt = require("jsonwebtoken");
const passport = require("passport");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../models/User.model.js");

require("dotenv").config();

// Get User data by Id
module.exports.userInfo = async (req, res) => {
  const _id = req.user;
  const user = await User.findById(_id)
    .populate("userNotices")
    .populate("userPets");
  res.status(200).json(user);
};

// Register New User and Check this email have in DB
module.exports.userRegister = (req, res) => {
  const userData = req.body;
  const { name, email, password } = req.body;
  const error = [];

  if (!email || !password || !name) {
    error.push("Please enter email and password and name.");
  } else {
    // Check basic creteria to password field for create user must
    if (password.length < 6) {
      error.push("Password must be at least 6 characters");
    }
  }

  if (error.length > 0) {
    res.status(400).json({
      success: false,
      message: error,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        error.push({ message: "Email already exists" });
        res.status(400).json({
          success: false,
          message: error[0].message,
        });
      } else {
        const newUser = new User({
          ...userData,
        });

        newUser.save().then((user) => {
          const userData = {
            id: String(user._id),
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
          };
          const token = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET);
          res.status(200).json({
            success: true,
            message: "Successfully created new user. You can Login",
            user: userData,
            token,
          });
        });
      }
    });
  }
};

// Update User data
module.exports.userUpdate = (req, res) => {
  const updateData = req.body;
  const id = req.user._id;

  const sendError = () => {
    res.status(400);
    res.json({
      status: "error",
      text: "there is no such user",
    });
  };

  const sendResponse = (newUser) => {
    if (!newUser) {
      return sendError();
    }

    res.json({
      status: "success",
      user: newUser,
    });
  };

  User.findByIdAndUpdate(
    id,
    { userImgUrl: req.file.path, ...updateData },
    { new: true }
  ).then((result) => {
    sendResponse(result);
  });
};

// Login User and get him Token for access to some route action
module.exports.userLogin = (req, res) => {
  passport.authenticate(
    "local",
    {
      session: false,
    },
    (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : "Login failed",
          user: user,
        });
      }

      req.login(
        user,
        {
          session: false,
        },
        (err) => {
          if (err) {
            res.status(301).json({ err });
          }

          const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
          return res.json({
            user,
            token,
          });
        }
      );
    }
  )(req, res);
};

// Logout User
module.exports.userLogout = (req, res) => {
  req.logout();
  res.status(200).json({
    message: "User successfully logout",
  });
};

// Reset password user from user have email with link url/:token
module.exports.resetPassword = (req, res) => {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    },
    function (err, user) {
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.status(400).json({
          message: "Password reset token is invalid or has expired.",
        });
      }
      res.render("reset", {
        user: req.user,
      });
    }
  );
};

//Send to user email link with url+token for reset pass
module.exports.forgotPassword = (req, res, next) => {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne(
          {
            email: req.body.email,
          },
          function (err, user) {
            if (!user) {
              req.flash("error", "No account with that email address exists.");
              return res.redirect("/forgot");
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function (err) {
              done(err, token, user);
            });
          }
        );
      },
      function (token, user, done) {
        const smtpTransport = nodemailer.createTransport("SMTP", {
          service: "SendGrid",
          auth: {
            user: "!!! YOUR SENDGRID USERNAME !!!",
            pass: "!!! YOUR SENDGRID PASSWORD !!!",
          },
        });
        var mailOptions = {
          to: user.email,
          from: "passwordreset@demo.com",
          subject: "Node.js Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/api/v1/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          req.flash(
            "info",
            "An e-mail has been sent to " +
              user.email +
              " with further instructions."
          );
          done(err, "done");
        });
      },
    ],
    function (err) {
      if (err) return next(err);
      res.redirect("/forgot");
    }
  );
};

module.exports.userChangePassword = (req, res) => {
  // Init Variables
  var passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function (err, user) {
        if (!err && user) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword;

            user.save(function (err) {
              if (err) {
                return res.status(422).json({
                  message: err,
                });
              } else {
                req.login(user, function (err) {
                  if (err) {
                    res.status(400).json({ message: err });
                  } else {
                    res.status(201).json({
                      message: "Password changed successfully",
                    });
                  }
                });
              }
            });
          } else {
            res.status(422).json({
              message: "Passwords do not match",
            });
          }
        } else {
          res.status(400).json({
            message: "User is not found",
          });
        }
      });
    } else {
      res.status(422).json({
        message: "Please provide a new password",
      });
    }
  } else {
    res.status(401).json({
      message: "User is not signed in",
    });
  }
};
