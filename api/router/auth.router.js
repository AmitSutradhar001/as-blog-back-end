import { Router } from "express";
import { signup, signin, google } from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.post("/signup", signup);
authRoute.post("/signin", signin);
authRoute.post("/google", google);

export default authRoute;
