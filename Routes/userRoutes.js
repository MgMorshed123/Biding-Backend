import express from "express";
import {
  fetchLeaderBoard,
  getProfile,
  login,
  logOut,
  register,
} from "../Controller/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/me", getProfile);
router.post("/logout", logOut);
router.post("/leader", fetchLeaderBoard);

export default router;
