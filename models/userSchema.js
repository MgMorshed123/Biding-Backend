import mongoose from "mongoose";

import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    minLength: [3, "username must contains at least 3 character"],
    maxLength: [40, "username can not exceed 40 characters"],
  },

  password: {
    type: String,
    selected: false,
    minLength: [8, "Password must contains at least 8 character"],
    maxLength: [40, "Password can not exceed 40 characters"],
  },

  email: String,
  address: String,
  phone: {
    type: String,
    selected: false,
    minLength: [11, "Phone number must contains exact 11 character"],
    maxLength: [11, "Phone number must contains exact 11 character"],
  },

  profileImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  paymentMethods: {
    bankTransfer: {
      bankAccountNumber: String,
      bankAccountName: String,
      bankName: String,
    },
    easypaisa: {
      easypaisaAccountNumber: Number,
    },

    paypal: {
      paypalEmail: String,
    },
  },

  role: {
    type: String,
    enum: ["Auctioneer", "Bidder", "Super Admin"],
  },
  unpaidComission: {
    type: Number,
    default: 0,
  },
  auctionMon: {
    type: Number,
    default: 0,
  },
  moneySpent: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", userSchema);
