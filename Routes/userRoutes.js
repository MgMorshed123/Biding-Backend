import express from "express";
import { register } from "../Controller/userController.js";

const router = express.Router();

router.post("/register", register);

export default router;
