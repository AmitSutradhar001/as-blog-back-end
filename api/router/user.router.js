import { Router } from "express";
import {
  updateUser,
  userController,
  deleteUser,
  signoutUser,
  getUsers,
  getTheUser,
  deleteUsers,
} from "../controllers/user.controller.js";
import { verifyToken } from "../func/verifyUser.js";
const userRouter = Router();

userRouter.get("/", userController);
userRouter.put("/update", verifyToken, updateUser);
userRouter.delete("/delete", verifyToken, deleteUser);
userRouter.post("/signout", verifyToken, signoutUser);
userRouter.get("/getusers", verifyToken, getUsers);
userRouter.delete("/deleteusers/:userId", verifyToken, deleteUsers);
userRouter.get("/getuser/:userId", getTheUser);

export default userRouter;
