import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../middlewares/error";
import { Auction } from "../models/auctionSchema";

export const placeBid = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const auctionItem = await Auction.findById(id);

  if (!auctionItem) {
    return next(new ErrorHandler("Auction Item not Found"), 400);
  }

  const { amount } = req.body;
  if (!amount) {
    return next(new ErrorHandler("Please Place Your bid "), 400);
  }

  if (amount <= auctionItem.currentBid) {
    return next(
      new ErrorHandler("Bid amount must be greater then current bid "),
      400
    );
  }
});
