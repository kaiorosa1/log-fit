import express from "express";
import * as exerciseController from "../controllers/exercise";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticate, exerciseController.createExercise); 
router.get("/", authenticate, exerciseController.getAllExercises); 
router.get("/:id", authenticate, exerciseController.getExerciseById);
router.put("/:id", authenticate, exerciseController.updateExercise);
router.delete("/:id", authenticate, exerciseController.deleteExercise);

export default router;
