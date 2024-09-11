import { Router } from "express";
import { verifyToken } from "../func/verifyUser.js";
import {
  createPost,
  getPosts,
  deletePosts,
  editPosts
} from "../controllers/post.controller.js";

const postRoute = Router();

postRoute.post("/create", verifyToken, createPost);
postRoute.get("/getposts", getPosts);
postRoute.delete("/deletepost/:postId", verifyToken, deletePosts);
postRoute.put("/editpost/:postId", verifyToken, editPosts);

export default postRoute;
