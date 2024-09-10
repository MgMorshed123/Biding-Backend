import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const register = async (req, res, next) => {
  if (!req.files || !req.files.profileImage) {
    return next(new ErrorHandler("Profile Image Required", 400));
  }

  const profileImage = req.files.profileImage;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedFormats.includes(profileImage.mimetype)) {
    return next(new ErrorHandler("File Format not Supported", 400));
  }

  const {
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    easypaisaAccountNumber,
    paypalEmail,
  } = req.body;

  if (!userName || !email || !password || !phone || !address || !role) {
    return next(new ErrorHandler("Please fill full form", 400));
  }

  if (role === "Auctioneer") {
    if (!bankAccountNumber || !bankAccountName || !bankName) {
      return next(new ErrorHandler("Please Provide your bank details", 400));
    }

    if (!easypaisaAccountNumber) {
      return next(
        new ErrorHandler("Please Provide Your Easypaisa Account Number", 400)
      );
    }
    if (!paypalEmail) {
      return next(new ErrorHandler("Please Provide Your PayPal Email", 400));
    }
  }

  const isRegistered = await User.findOne({ email });

  if (isRegistered) {
    return next(new ErrorHandler("User already registered", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    profileImage.tempFilePath,
    {
      folder: "MERN_AUCTION_PLATFORM_USERS",
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

  const user = await User.create({
    userName,
    email,
    password,
    phone,
    address,
    role,
    profileImage: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },

    paymentMethods: {
      bankTransfer: {
        bankAccountNumber,
        bankAccountName,
        bankName,
      },
      easypaisa: {
        easypaisaAccountNumber,
      },

      paypal: {
        paypalEmail,
      },
    },
  });

  res.status(201).json({
    success: true,
    message: "User Registered Successfully",
  });
};
