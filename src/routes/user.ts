import express from "express";
import * as userController from "../controllers/user";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Create new user (registration)
router.post("/", userController.createUser); 

// Login route
router.post("/login", userController.login);

// Get current user (protected route)
router.get("/me", authenticate, userController.getCurrentUser);

export default router;
