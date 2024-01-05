class AppError extends Error {
    status;
    statusCode;
    isOperational;

    constructor(message, statusCode = 500) {
        super(message);

        this.statusCode = statusCode;
        this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
