import Joi from "joi"
import { User } from "../models/user.js";
import crypto from "crypto"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { sendError, sendSuccess } from "../helpers/requestHandler.js";
import { throwCustomError } from "../helpers/error.js";
import * as dotenv from "dotenv";
import { getIpInfo } from "../helpers/utils.js";
dotenv.config()

export const login = async (req, res) => {
    try {
        console.log("called")
        const { email, password } = req?.body;
        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().required()
        })

        const { error } = schema.validate(req.body)
        error ? throwCustomError(1002) : "";
        const userExists = await User.findOne({
            where: {
                email_id: email
            }
        });

        if (!userExists) {
            //throw err if no user exist
            throwCustomError(1050)
        }

        const isValid = await bcrypt.compare(password, userExists?.password)
        const response = { email: email };
        const payload = {
            email: userExists?.email,
            createdAt: userExists?.created_at
        }
        if (isValid) {

            if (userExists.is_verified && userExists.otp_created_at) {
                response.token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" })
                response.refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5d" })
                return sendSuccess(req, res, "login successful", 200)(response)
            }
            //throw err if email not verified
            throwCustomError(1052)

        } else {
            //throw err if password is not matching
            throwCustomError(1050)
        }

    } catch (error) {
        console.log(error)
        sendError(req, res, error)
    }
}




export const register = async (req, res) => {
    try {

        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().min(8).max(16).required(),
            confirmPassword: Joi.string().valid(Joi.ref('password')),
        })



        const { error } = schema.validate(req.body);
        error ? throwCustomError(1002) : "";

        //fetching ip from header or a failsafe ip for testing
        const ip = req.headers['x-forwarded-for'] || '103.181.40.109'
        const blockedCountries = process.env.BLOCKED_COUNTRIES;
        const { countryCode } = await getIpInfo(ip);

        //check weather the country is blocked
        const blockedCountry = blockedCountries.split(",").includes(countryCode);
        if (blockedCountry) {
            throwCustomError(1057)
        }

        const emailExists = await User.findOne({ where: { email_id: req?.body?.email } });

        if (emailExists) {
            throwCustomError(1051)
        }
        //generating otp
        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedPassword = await bcrypt.hash(req?.body?.password, 10);

        await User.create({
            email_id: req.body.email,
            password: hashedPassword,
            otp,
            otp_created_at: new Date(),
            country_code: countryCode,
            role: "ADMIN"
        })

        // logic for sending otp through mail should come here

        console.log("done")
        return sendSuccess(req, res, "registration successful", 200)()

    } catch (error) {
        console.log(error)
        sendError(req, res, error)
    }
}



export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            otp: Joi.string().min(6).max(6).required()
        })
        const { error } = schema.validate(req.body);
        console.log(error)
        error ? throwCustomError(1002) : "";
        const user = await User.findOne({
            where: {
                otp,
                email_id: email
            },
            raw: true
        });

        if (!user) {
            //throw err if the otps are not matching
            throwCustomError(1053)
        } else {
            const one_hr = 60 * 60 * 1000;
            if (user.is_verified && user.email_verified_at) {
                //throw err if otp already verified
                throwCustomError(1058)
            }
            if (new Date() - user.otp_created_at > one_hr) {
                //throw err if otp generated before 1hr
                throwCustomError(1054)
            }
            console.log("", otp, ",", email)
            await User.update({ is_verified: true, email_verified_at: new Date() }, {
                where: {
                    otp,
                    email_id: email
                }
            });
            return sendSuccess(req, res, "otp verified successfully")()
        }


    } catch (error) {
        console.log(error)
        sendError(req, res, error)
    }
}

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2 }).required()
        })
        const { error } = schema.validate(req.body)
        error ? throwCustomError(1002) : ""
        const user = await User.findOne({ where: { email_id: email }, raw: true })
        if (user.is_verified == true) {
            throwCustomError(1058)
        }
        const newOtp = crypto.randomInt(100000, 999999).toString()
        await User.update({ otp: newOtp, otp_created_at: new Date() }, { where: { email_id:email } });

        //logic for send new otp through mail should come here

        return sendSuccess(req, res, "otp resent successful")()
    } catch (error) {
        console.log(error)
        sendError(req, res, error)
    }
}