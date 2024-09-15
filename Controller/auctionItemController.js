import req from "express/lib/request";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../middlewares/error";
import { Auction } from "../models/auctionSchema";
import { v2 as cloudinary } from "cloudinary";

export const addNewAuctionItem = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.image) {
    return next(new ErrorHandler("Auction item image required", 400));
  }

  const image = req.files.image;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedFormats.includes(image.mimetype)) {
    return next(new ErrorHandler("File Format not Supported", 400));
  }

  const { title, description, category, condition, startTime, endTime } =
    req.body;

  if (
    !title ||
    !description ||
    !category ||
    !condition ||
    !startTime ||
    !endTime
  ) {
    return next(new ErrorHandler("Please provide all fields ", 400));
  }

  if (new Date(startTime) < Date.now()) {
    return next(
      new ErrorHandler(
        "Auction Starting time must be greater than Present Time  ",
        400
      )
    );
  }

  if (new Date(startTime) >= new Date(endTime)) {
    return next(
      new ErrorHandler(
        "Auction Starting time must be less  than ending Time  ",
        400
      )
    );
  }

  const alreadyOneAuctionActive = await Auction.find({
    createdBy: req.user._id,
    endTime: { $gt: Date.now() },
  });

  if (alreadyOneAuctionActive) {
    return next(new ErrorHandler("You have Already Active Auction"));
  }

  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath,
      {
        folder: "MERN_AUCTION_PLATFORM_AUCTIONS",
      }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error",
        cloudinaryResponse.error || "Unknown Cloudinary Error"
      );

      return next(
        new ErrorHandler("Failed to Upload Profile Image to Cloudinary")
      );
    }

    const auctionItem = await Auction.create({
      title,
      description,
      category,
      condition,
      startTime,
      endTime,
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: false,
      message: "Auction created Successfully",
    });
  } catch (error) {}
});
