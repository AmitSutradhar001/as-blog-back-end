import { connect, model } from "mongoose";
import "dotenv/config";
import userModel from "./user.model.js";
import postModel from "./post.model.js";

const MONGODB_URL = process.env.MONGODB_URL;
try {
  connect(MONGODB_URL).then(() => console.log("DataBase Connected!"));
} catch (error) {
  console.log(error.massage);
}
export const User = model("User", userModel);
export const Post = model("Post", postModel);
