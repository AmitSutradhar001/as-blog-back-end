import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./router/user.router.js";
import authRouter from "./router/auth.router.js";
import notFound from "../middleware/notFound.js";
import err from "../middleware/err.js";
import postRoute from "./router/post.route.js";
import commentRoute from "./router/comment.router.js";

// Initialize the app
const app = express();

// Middleware
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true, // Allow cookies
};
app.use(cors(corsOptions)); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser());
// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);

// Error handling middleware
app.use(notFound); // Handle 404 errors
app.use(err); // Handle other errors

// Server setup
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
