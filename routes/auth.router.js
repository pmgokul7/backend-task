import express from "express";
import { login, register, resendOtp, verifyOtp } from "../controllers/auth.controller.js";


const authRoute = express.Router()

//route for login
authRoute.post("/login", login)

//route for register users
authRoute.post("/register", register)

//route for verifying otp
authRoute.post("/verify-otp", verifyOtp)

//route for resending otp
authRoute.post("/resend-otp", resendOtp)


export default authRoute;