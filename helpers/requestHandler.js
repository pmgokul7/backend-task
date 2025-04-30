import { CustomError } from "./error.js";

export const sendSuccess = (req, res, msg ,code = 200) => {
    try {
        console.log("first")
        const response = {
            type: "SUCCESS",
            message:msg
        };
        return (data = null) => {  // This should return the function to handle the response
            if (data) {
                response.data = data;
            }
            res.status(code).json(response);
        };
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: "ERROR", message: "Something went wrong." });
    }
};


export const sendError = (req, res, err) => {
  
    const response = { type: "ERROR", message: "Something went wrong.",code:1001 }

    if (err instanceof CustomError) {

        const statusCode = err?.code
        const errMessage = err?.message
        response.message = err.message;
        response.code = err?.errCode
        return res.status(statusCode).json(response)
    } else {
        const statusCode = 500
        return res.status(statusCode).json(response)
    }

}