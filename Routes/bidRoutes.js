import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { placeBid } from "../Controller/bidController.js";
import { checkAuctionEndTime } from "../middlewares/checkAuctionEndTime.js";

const router = express.Router();

router.post(
  "/place/:id",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  checkAuctionEndTime,
  placeBid
);

export default router;
