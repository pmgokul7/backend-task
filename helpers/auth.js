import { throwCustomError } from "./error.js";
import { sendError } from "./requestHandler.js";
import * as dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()
const SECRET_KEY = process.env.JWT_SECRET;
export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        

        if (!token) {
            throwCustomError(1055)
        }

        if (token.split(" ")[0] !== "Bearer") {
            throwCustomError(1055)
        }

        if (!token.split(" ")[1]) {
            throwCustomError(1055)
        }

        const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
        req.decoded = decoded;
        next()

    } catch (error) {
        console.log("jwt verification failed", error)
        sendError(req, res, error)
    }
}