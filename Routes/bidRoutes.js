import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth";
import { placeBid } from "../Controller/bidController";

const router = express.Router();

router.post(
  "/place/:id",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  placeBid
);
