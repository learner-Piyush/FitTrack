import { Router } from "express";
import {
  createDietLog,
  getDietLogs,
  getDietLogById,
  updateDietLog,
  deleteDietLog,
} from "../controllers/diet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createDietLog).get(getDietLogs);

router
  .route("/:dietId")
  .get(getDietLogById)
  .patch(updateDietLog)
  .delete(deleteDietLog);

export default router;
