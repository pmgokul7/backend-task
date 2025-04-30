import errorList from "./errors.json" assert { type: "json" };

export class CustomError extends Error {
    constructor(code) {
        const errors = errorList[0];
        const errorEntry = errors[code];

        if (!errorEntry) {
            super(errorCode["1000"]["message"]);
            this.code = 1000;
            this.name = "CustomError";
            return;
        }
        console.log(errorEntry)
        const { message, code: errorCode } = errorEntry;
        super(message);
        this.code = errorCode;
        this.name = "CustomError";
        this.errCode = code;
        
    }
}

export const throwCustomError = (code) => {
    throw new CustomError(code);
}
