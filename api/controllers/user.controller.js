import bcryptjs from "bcryptjs";
import { User } from "../data/mongodb.js";
export const userController = (req, res) => {
  console.log("get the req!");
};

export const updateUser = async (req, res, next) => {
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next({
        status: 400,
        message: "Password must be at least 6 characters!",
      });
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next({
        status: 400,
        message: "Username must be between 7 and 20 characters!",
      });
    }
    if (req.body.username.includes(" ")) {
      return next({
        status: 400,
        message: "Username can't contain spaces!",
      });
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next({
        status: 400,
        message: "Username must be lowercase!",
      });
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next({
        status: 400,
        message: "Username can only contain letters and numbers!",
      });
    }
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );

    if (!user) {
      return next({
        status: 404,
        message: "User not found.",
      });
    }

    const { password, ...rest } = user._doc;
    res.status(200).json({ user: rest });
  } catch (error) {
    return next({
      status: error.status || 500,
      message: error.message || "An error occurred while updating the user.",
    });
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.user._id;
  if (!userId)
    return next({
      status: 404,
      message: "Sign In Again!",
    });
  try {
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: "User has been deleted!" });
  } catch (error) {
    return next({
      status: error.status || 500,
      message: error.message || "An error occurred while deleting the user.",
    });
  }
};

export const signoutUser = async (req, res, next) => {
  try {
    return res.status(200).json({ message: "User Sign Out Successfully!" });
  } catch (error) {
    return next({
      status: error.status || 500,
      message: error.message || "An error occurred while sign out the user.",
    });
  }
};
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next({
      status: 403,
      message: "You are not allowed to see all users!",
    });
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 6;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    // Get the users with pagination, sorting, and excluding the password field
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Count total users
    const totalUsers = await User.countDocuments();

    // Get date for one month ago
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    // Count users created in the last month
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Return response
    return res
      .status(200)
      .json({ users, totalUsers, lastMonthUsers, message: "Users are here!" });
  } catch (error) {
    return next({
      status: error.status || 500,
      message: error.message || "An error occurred while fetching users.",
    });
  }
};
export const deleteUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next({
      status: 403,
      message: "You are not allowed to delete this post!",
    });
  }
  console.log(req.params.userId);

  try {
    await User.findByIdAndDelete(req.params.userId);
    return res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    return next({
      status: error.status || 500,
      message: error.message || "Internal server error!",
    });
  }
};

export const getTheUser = async (req, res, next) => {
  try {
    // Get the users with pagination, sorting, and excluding the password field
    const users = await User.findById(req.params.userId).select("-password");
    if (!users)
      return next({
        status: 404,
        message: "No user found!",
      });
    // Return response
    return res.status(200).json(users);
  } catch (error) {
    return next({
      status: error.status || 500,
      message: error.message || "An error occurred while fetching users.",
    });
  }
};
