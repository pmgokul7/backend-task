import express from "express";
import authRoute from "./auth.router.js";
import productRoute from "./product.route.js";

const router = express.Router()

router.use("/auth",authRoute)

router.use("/product",productRoute)


export default router