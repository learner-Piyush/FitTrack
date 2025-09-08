import { Router } from "express";
import {
  addProgress,
  getProgress,
  updateProgress,
  deleteProgress,
} from "../controllers/progress.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(addProgress).get(getProgress);

router
  .route("/:progressId")
  .patch(updateProgress)
  .delete(deleteProgress);

export default router;
