const jwt = require("jsonwebtoken");
const { User } = require("../models/User.model");
const secret = process.env.SECRET;

module.exports = {
  authMiddleware: async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({
          success: false,
          message: "Please, provide a tokin in request authorization header",
        });
      }
      const [, token] = authorization.split(" ");
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Not authorized",
        });
      }
      const { id } = jwt.decode(token, secret);
      const userFind = await User.findById(id);
      if (!userFind) {
        return res.status(401).json({
          success: false,
          message: "Not authorized",
        });
      }
      const TokenExpired = isTokenExpired(token);
      if (TokenExpired) {
        return res.status(401).json({
          success: false,
          message: "Token is expired",
        });
      }
      req.user = userFind;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
  },
};

const isTokenExpired = (token) =>
  Date.now() >=
  JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).exp * 1000;
