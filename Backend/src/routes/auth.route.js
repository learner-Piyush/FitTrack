import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  changeCurrentPassword,
  deleteAccount,
} from "../controllers/auth.controller.js";
import {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgetPasswordValidator,
  userResetForgetPasswordValidator,
} from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// unsecured routes
router
  .route("/register")
  .post(
    userRegisterValidator(),
    validate,
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    registerUser,
  );
router.route("/login").post(userLoginValidator(), loginUser);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/forgot-password")
  .post(userForgetPasswordValidator(), forgotPasswordRequest);
router
  .route("/reset-password/:resetToken")
  .post(userResetForgetPasswordValidator(), resetForgotPassword);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword,
  );
router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);
router.route("/delete-account").delete(verifyJWT, deleteAccount);

export default router;
