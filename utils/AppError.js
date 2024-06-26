class AppError extends Error {
    status;
    statusCode;
    isOperational;

    /**
     * Constructor to initialize an AppError instance
     * @param {string} message - Error message
     * @param {number} [statusCode=500] - HTTP status code, default is 500
     */
    constructor(message, statusCode = 500) {
        super(message); // Call the parent class (Error) constructor with the message

        this.statusCode = statusCode;
        // Set the status based on the status code
        this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
        // Mark the error as operational
        this.isOperational = true;

        // Capture the stack trace, excluding the constructor call
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
