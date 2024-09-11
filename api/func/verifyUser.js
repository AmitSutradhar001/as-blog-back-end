import jwt from "jsonwebtoken";

export const verifyToken = (req, _, next) => {
  const token = req.cookies.asblog_token;

  console.log("token::-> ", token);
  console.log("asblog_token::-> ", req.cookies.asblog_token);
  console.log("all cookies::->", req.cookies);
  console.log("req::-> ", req);

  if (!token) {
    return next({
      status: 401,
      message: "Unauthorized User!",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return next({
        status: 401,
        message: "Unauthorized User!",
      });
    }
    req.user = user.user;
    next();
  });
};
