import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

/* middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

/* routes */
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

/* test */
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

/* ---------- DB ---------- */
let isConnected = false;
const connectDBOnce = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

/* ---------- LOCAL DEV ---------- */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;

  connectDBOnce().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running locally on port ${PORT}`);
    });
  });
}

/* ---------- VERCEL SERVERLESS ---------- */
export default async function handler(req, res) {
  await connectDBOnce();
  return app(req, res);
}
