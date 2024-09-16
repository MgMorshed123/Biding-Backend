import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import connectToDb from "./db.js";
import errorMiddleWare from "./middlewares/error.js";
import userRoutes from "./Routes/userRoutes.js";
import auctionItemRoutes from "./Routes/auctionItemRoutes.js";

const app = express();

config({
  path: "./config/config.env",
});

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST", "GET", "PUT", "DELETE"],
    Credential: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auctionitem", auctionItemRoutes);

app.use(errorMiddleWare);
connectToDb();
export default app;
