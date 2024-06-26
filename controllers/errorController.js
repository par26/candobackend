const AppError = require("../utils/AppError");
const { Error: MongooseErrors } = require("mongoose");

// Function to send detailed error information during development
function sendDevelopmentError(error, res) {
    res.status(error.statusCode).json({
        status: error.status,
        error,
        message: error.message,
        stack: error.stack,
    });
}

// Function to send limited error information during production
function sendProductionError(error, res) {
    // If the error is not operational, send a generic error message
    if (!error.isOperational) {
        res.status(500).json({
            status: "error",
            message: "Oops, something went wrong",
        });
        return;
    }

    // Log the error for debugging purposes
    console.error("!!!ERROR!!!", error);

    // Send the error status and message
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
    });
}

// Function to handle Mongoose CastError (invalid ID format, etc.)
function handleCastErrorDB(error) {
    const message = `Invalid ${error.path}: ${error.value}.`;
    return new AppError(message, 400);
}

// Function to handle Mongoose duplicate key errors
function handleDuplicateFieldDB(error) {
    const message = `Duplicate field value: "${error.keyValue.name}". Please use another value`;
    return new AppError(message, 400);
}

// Function to handle Mongoose validation errors
function handleValidationErrorDB(error) {
    const errors = Object.values(error.errors).map(
        validationError => validationError.message
    );
    const message = `Invalid input data. ${errors.join(". ")}.`;
    return new AppError(message, 400);
}

// Main error handling middleware function
module.exports = (error, req, res, next) => {
    // Handle non-object errors gracefully
    if (typeof error !== "object") {
        const message =
            process.env.NODE_ENV === "development"
                ? { errorValue: error }
                : "Unknown error";

        return res.status(500).json({
            status: "error",
            error: message,
        });
    }

    // Set default status code and status if not already set
    error.statusCode ||= 500;
    error.status ||= "error";

    // Send detailed error information during development
    if (process.env.NODE_ENV === "development") {
        sendDevelopmentError(error, res);
    }
    // Handle specific error types during production
    else if (process.env.NODE_ENV === "production") {
        let clonedError = { ...error };

        // Handle Mongoose CastError
        if (error instanceof MongooseErrors.CastError) {
            clonedError = handleCastErrorDB(error);
        }
        // Handle Mongoose duplicate key error
        else if (error.code === 11000) {
            clonedError = handleDuplicateFieldDB(error);
        }
        // Handle Mongoose validation error
        else if (error instanceof MongooseErrors.ValidationError) {
            clonedError = handleValidationErrorDB(error);
        }

        // Send error response
        sendProductionError(clonedError, res);
    }
};
