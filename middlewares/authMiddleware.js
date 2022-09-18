const jwt = require("jsonwebtoken");
const { User } = require("../models/User.model");
const { Unauthorized } = require("http-errors");
const secret = process.env.SECRET;

module.exports = {
  authMiddleware: async (req, res, next) => {
    console.log("1111", req.headers);
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        next(
          new Unauthorized(
            "Please, provide a tokin in request authorization header"
          )
        );
      }
      console.log("nentoken");
      const [, token] = authorization.split(" ");
      console.log(token);
      if (!token) {
        next(new Unauthorized("Not authorized"));
      }
      const user = jwt.decode(token, secret);
      const userFind = await User.findById(user.id);
      if (!userFind || token !== userFind.token) {
        next(new Unauthorized("Not authorized"));
      }
      const TokenExpired = isTokenExpired(token);

      if (TokenExpired) {
        throw new Unauthorized("Token is expired");
      }
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
   
      next(new Unauthorized("Not authorized"));
    }
  },
};

const isTokenExpired = (token) =>
  Date.now() >=
  JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).exp * 1000;
