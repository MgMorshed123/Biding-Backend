import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { addNewAuctionItem } from "../Controller/auctionItemController";

const router = express.Router();

router.post("/create", isAuthenticated, addNewAuctionItem);

export default router;
