import { User } from "../models/userSchema";
import { catchAsyncErrors } from "./catchAsyncErrors";
import ErrorHandler from "./error";

export const trackCommissionStatus = catchAsyncErrors(
  async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (user.unpaidCommission > 0) {
      return next(
        new ErrorHandler(
          "You have unpaid Commissions . Please pay  them before posting a new Auction"
        )
      );
    }

    next();
  }
);
