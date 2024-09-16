import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth";
import {
  addNewAuctionItem,
  getAllItems,
  getAuctionDetails,
  getMyAuctionItems,
  removeFromAuction,
  republishItem,
} from "../Controller/auctionItemController";
import { trackCommissionStatus } from "../middlewares/trackCommisionStatus";

const router = express.Router();

router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  trackCommissionStatus,
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

router.get(
  "/myitems",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  getMyAuctionItems
);

router.put(
  "/item/republish/:id",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  republishItem
);

export default router;
