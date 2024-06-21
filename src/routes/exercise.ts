import express from "express";
import * as exerciseController from "../controllers/exercise";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticate, exerciseController.createExercise); 


export default router;
