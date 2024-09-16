import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

export const removeFromAuction = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id Format", 400));
  }

  const auctionItem = await Auction.findById(id);

  if (!auctionItem) {
    return next(new ErrorHandler("Auction Not Found ", 400));
  }

  await auctionItem.deleteOne();
  res.status(200).json({
    success: true,
    message: "Auction Items Deleted Successfuly",
  });
});
