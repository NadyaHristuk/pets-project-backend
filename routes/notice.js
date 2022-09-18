const express = require("express");
const router = express.Router();

const NoticeController = require("../controllers/notice.js");
const { authMiddleware } = require("../middlewares/authMiddleware");

const uploadCloud = require("../middlewares/uploadMiddleware.js");

router.post(
  "/",
  authMiddleware,
  uploadCloud.single("animals_photos"),
  NoticeController.noticeCreate
);
router.delete("/:id", authMiddleware, NoticeController.noticeDelete);
router.get("/:limit", authMiddleware, NoticeController.noticeOfUser);
router.get("/:id", NoticeController.noticeByID);

router.get("/selected/", authMiddleware, NoticeController.noticeSelected);
router.post(
  "/selected/:id",
  authMiddleware,
  NoticeController.noticeSelectedCreate
);
router.delete(
  "/selected/:id",
  authMiddleware,
  NoticeController.noticeSelectedDelete
);

router.get("/notice/category", NoticeController.noticeCategory);

module.exports = router;
