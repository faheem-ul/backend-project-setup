import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  generateNewAccessToken,
  updateUserPassword,
  getCurrentUserProfile,
  updateUserAvatar,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);

router.route("/login").post(loginUser);
router.route("/update-password").post(updateUserPassword);
router.route("/current-profile").get(verifyJwt, getCurrentUserProfile);
router
  .route("/update-avatar")
  .post(verifyJwt, upload.single("avatar"), updateUserAvatar);

//secured routes
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(generateNewAccessToken);

export default router;
