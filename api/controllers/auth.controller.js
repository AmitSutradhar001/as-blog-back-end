import { User } from "../data/mongodb.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return next({
      status: 400,
      message: "Email, username, or password is missing",
    });
  }

  try {
    const validUser = await User.findOne({ email });

    if (validUser) {
      return next({ status: 409, message: "User already exist!" });
    }
    const hashPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      email,
      password: hashPassword,
      username,
    });

    await newUser.save();
    return res.status(201).json({ message: "User is created successfully!" });
  } catch (error) {
    return next({
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    });
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next({ status: 400, message: "All fields are required!" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next({ status: 404, message: "User not found!" });
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return next({ status: 400, message: "Invalid Password!" });
    }
    user.password = "****";
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json({ asblog_token: token, message: "Signed in successfully!" });
  } catch (error) {
    return next({
      status: error.status || 500,
      message: error.message || "Internal Server Error!",
    });
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      user.password = "****";
    } else {
      const genPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(genPassword, 10);
      user = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await user.save();
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json({ asblog_token: token, message: "Signed in successfully!" });
  } catch (error) {
    return next({
      status: error.status || 500,
      message: error.message || "Internal Server Error!",
    });
  }
};
