import mongoose from "mongoose";

const connectToDb = () => {
  try {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("Connected to MongoDB"));
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
  }
};

export default connectToDb;
