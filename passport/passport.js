const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../../models/User.model");

require("dotenv").config();

// Setup work and export for the JWT passport strategy
module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.JWT_ACCESS_SECRET_KEY;
console.log("reer");
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      User.findById(jwt_payload.id, function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      function (email, password, cb) {
        //Assume there is a DB module providing a global UserModel
        return User.findOne({ email })
          .then((user) => {
            if (!user) {
              return cb(null, false, {
                message: "Incorrect email or password.",
              });
            }
            user.comparePassword(password, function (err, isMatch) {
              if (!isMatch) {
                return cb(null, false, {
                  message: "Incorrect email or password.",
                });
              }

              if (isMatch && !err) {
                return cb(null, user, {
                  message: "Logined Successfully",
                });
              }
            });
          })
          .catch((err) => {
            return cb(err);
          });
      }
    )
  );
};
