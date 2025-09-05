import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+=-`])[A-Za-z\d~!@#$%^&*()_+=-`]{8,}$/,
      )
      .withMessage(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (~!@#$%^&*()_+=-`)",
      ),
    body("fullName")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Full name must be at least 3 characters long"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword")
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+=-`])[A-Za-z\d~!@#$%^&*()_+=-`]{8,}$/,
      )
      .withMessage(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (~!@#$%^&*()_+=-`)",
      ),
  ];
};

const userForgetPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Old password is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgetPasswordValidator = () => {
  return [
    body("newPassword")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+=-`])[A-Za-z\d~!@#$%^&*()_+=-`]{8,}$/,
      )
      .withMessage(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (~!@#$%^&*()_+=-`)",
      ),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgetPasswordValidator,
  userResetForgetPasswordValidator,
};
