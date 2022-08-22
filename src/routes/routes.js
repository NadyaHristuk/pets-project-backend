const express = require("express");
const router = express.Router();
const passport = require("passport");
const cors = require("cors");
const notFoundHandler = require("../middleware/not-found");
const serverErrorHandler = require("../middleware/server-error.js");
const config = require("../../config/index");

const UserController = require("../controllers/user.js");
const PetController = require("../controllers/pet.js");
const NoticeController = require("../controllers/notice.js");

const NewsController = require("../controllers/news.js");
const SponsorsController = require("../controllers/sponsor.js");
const uploadCloud = require("../middlewares/uploadMiddleware.js");

const passportCheck = (req, res, next) =>
  passport.authenticate("jwt", {
    session: false,
    failWithError: true,
  })(req, res, next);

const setupCORSForDevelopment = (developmentUrl) => {
  const corsOptions = {
    origin: developmentUrl,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "X-Requested-With",
      "Accept",
    ],
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  };

  router.use(cors(corsOptions));
};

if (process.env.NODE_ENV === "development") {
  const { client } = config;
  const developmentUrl = `${client.development.url}:${client.development.port}`;

  setupCORSForDevelopment(developmentUrl);
}

if (process.env.NODE_ENV === "production") {
  // Setup CORS for production
  router.use(cors("*"));
}

router.post("/user/register", UserController.userRegister);

router.post("/user/login", UserController.userLogin);
router.get("/user/info", passportCheck, UserController.userInfo);
router.put(
  "/user/update",
  passportCheck,
  uploadCloud.single("avatar"),
  UserController.userUpdate
);
router.get("/user/info", passportCheck, UserController.userInfo);

router.post(
  "/pet/",
  passportCheck,
  uploadCloud.single("avatarURL"),
  PetController.petRegister
);
router.delete("/pet/:id", passportCheck, PetController.petDelete);

router.get(
  "/notice/selected/",
  passportCheck,
  NoticeController.noticeSelOfUser
);
router.post(
  "/notice/selected/:id",
  passportCheck,
  NoticeController.noticeSelCreate
);
router.delete(
  "/notice/selected/:id",
  passportCheck,
  NoticeController.noticeSelDelete
);

router.get("/notice/category", NoticeController.noticeCategory);
router.post(
  "/notice/",
  passportCheck,
  uploadCloud.single("animals_photos"),
  NoticeController.noticeCreate
);
router.delete("/notice/:id", passportCheck, NoticeController.noticeDelete);
router.get("/notice/", passportCheck, NoticeController.noticeOfUser);
router.get("/notice/:id", passportCheck, NoticeController.noticeByID);

router.get("/news", NewsController.getNews);
router.get("/sponsors-info", SponsorsController.getSponsorsInfo);

router.use(notFoundHandler);
router.use(serverErrorHandler);

module.exports = router;
