import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  Cloud_name: process.env.Cloud_name,
  API_Secret: process.env.API_Secret,
  api_Key: process.env.api_Key,
});
app.listen(process.env.PORT, () => {
  console.log(`server is listening on PORT ${process.env.PORT}`);
});
