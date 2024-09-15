import express from "express";
import {
  fetchLeaderBoard,
  getProfile,
  login,
  logOut,
  register,
} from "../Controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getProfile);
router.post("/logout", logOut);
router.post("/leader", fetchLeaderBoard);

export default router;
