import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth";
import {
  addNewAuctionItem,
  getAllItems,
  getAuctionDetails,
  removeFromAuction,
  republishItem,
} from "../Controller/auctionItemController";

const router = express.Router();

router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  addNewAuctionItem
);

router.get("/allitems", getAllItems);

router.get("/auction/:id", isAuthenticated, getAuctionDetails);

router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  removeFromAuction
);

router.put(
  "/item/republish/:id",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  republishItem
);

export default router;
