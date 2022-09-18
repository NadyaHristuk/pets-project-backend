const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } = process.env;

const {
  User,
  joiLoginSchema,
  joiRegisterSchema,
} = require("../models/User.model.js");

require("dotenv").config();

module.exports.userInfo = async (req, res) => {
  const _id = req.user;
  const user = await User.findById(_id, {
    createdAt: 0,
    updatedAt: 0,
    password: 0,
  })
    .populate("ownNotices", { title: 1, description: 1 })
    .populate("userPets", { owner: 0, createdAt: 0, updatedAt: 0, __v: 0 })
    .populate("favoriteNotices", { title: 1, description: 1 });
  res.status(200).json(user);
};

module.exports.userRegister = (req, res, next) => {
  try {
    const { error } = joiRegisterSchema.validate(req.body);
    if (error) {
      throw new createError.BadRequest(error.message);
    }
    const { name, email, password, city, phone } = req.body;
    User.findOne({ email }).then((user) => {
      if (user) {
        res.status(400).json({
          success: false,
          message: `User with email ${email} already exist`,
        });
      }
      const newUser = new User({
        name,
        email,
        city,
        phone,
      });
      newUser.setPassword(password);

      newUser.save().then((user) => {
        const {
          _id,
          name,
          email,
          city,
          phone,
          birthday,
          userImgUrl,
          userPets,
          ownNotices,
          favoriteNotices,
        } = user;

        const userData = {
          id: String(_id),
          name,
          email,
          city,
          phone,
          birthday,
          userImgUrl,
          userPets,
          ownNotices,
          favoriteNotices,
        };

        res.status(200).json({
          success: true,
          message: "Successfully created new user. You can Login",
          user: userData,
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

// Login User and get him Token for access to some route action
module.exports.userLogin = async (req, res, next) => {
  try {
    const { error } = joiLoginSchema.validate(req.body);

    if (error) {
      throw new createError.BadRequest(error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.comparePassword(password)) {
      throw new createError.Unauthorized("Email or password is wrong");
    }
    const payload = {
      id: user._id,
    };
    const newAccessToken = jwt.sign(payload, JWT_ACCESS_SECRET_KEY, {
      expiresIn: "1h",
    });
    const newRefreshToken = jwt.sign(payload, JWT_REFRESH_SECRET_KEY, {
      expiresIn: "30d",
    });

    const {
      _id,
      name,
      city,
      phone,
      birthday,
      userImgUrl,
      userPets,
      ownNotices,
      favoriteNotices,
    } = user;

    return res.json({
      id: String(_id),
      name,
      email,
      city,
      phone,
      birthday,
      userImgUrl,
      userPets,
      ownNotices,
      favoriteNotices,
      data: {
        newAccessToken,
        newRefreshToken,
      },
    });
  } catch (error) {
    next(error);
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
 
  const data = !!req.file
    ? { userImgUrl: req.file.path, ...updateData }
    : { ...updateData };
 
  User.findByIdAndUpdate(id, data, { new: true }).then((result) => {
    sendResponse(result);
  });
};

module.exports.refreshTokens = async (req, res) => {
  const authorizationHeader = req.get("Authorization");

  if (authorizationHeader) {
    const reqRefreshToken = authorizationHeader.replace("Bearer ", "");

    try {
      const { id } = jwt.verify(reqRefreshToken, JWT_REFRESH_SECRET_KEY);
      const user = await User.findById(id);

      if (!user) {
        throw new createError.NotFound("Invalid user");
      }

      const newAccessToken = jwt.sign({ id: user._id }, JWT_ACCESS_SECRET_KEY, {
        expiresIn: "1h",
      });
      const newRefreshToken = jwt.sign(
        {
          id: user._id,
        },
        JWT_REFRESH_SECRET_KEY,
        { expiresIn: "30d" }
      );
      res.json({
        status: "success",
        code: 200,
        data: {
          newAccessToken,
          newRefreshToken,
        },
      });
    } catch (err) {
      throw new Error("Not authorized");
    }
  }
  throw new Error("No token provided");
};

// Logout User
// module.exports.userLogout = (req, res) => {

//   res.status(200).json({
//     message: "User successfully logout",
//   });
// };
