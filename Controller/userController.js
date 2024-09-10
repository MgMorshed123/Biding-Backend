import ErrorHandler from "../middlewares/error";
import { User } from "../models/userSchema";
import { v2 as cloudinary } from "cloudinary";

export const register = async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Profile Image Required", 400));
  }

  const { profileImage } = req.file;

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
      return next(new ErrorHandler("Please Provide Your paypalEmail", 400));
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
      new ErrorHandler("Failed to Upload Profle Image to cloudinary")
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
        bankNameString,
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
