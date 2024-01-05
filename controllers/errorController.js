const AppError = require("../utils/AppError");
const { Error: MongooseErrors } = require("mongoose");

function sendDevelopmentError(error, res) {
    res.status(error.statusCode).json({
        status: error.status,
        error,
        message: error.message,
        stack: error.stack,
    });
}

function sendProductionError(error, res) {
    if (!error.isOperational) {
        res.status(500).json({
            status: "error",
            message: "Oops, something went wrong",
        });
        return;
    }

    console.error("!!!ERROR!!!", error);

    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
    });
}

function handleCastErrorDB(error) {
    const message = `Invalid ${error.path}: ${error.value}.`;
    return new AppError(message, 400);
}

function handleDuplicateFieldDB(error) {
    const message = `Duplicate field value: "${error.keyValue.name}". Please use another value`;
    return new AppError(message, 400);
}

function handleValidationErrorDB(error) {
    const errors = Object.values(error.errors).map(
        validationError => validationError.message
    );
    const message = `Invalid input data. ${errors.join(". ")}.`;
    return new AppError(message, 400);
}

module.exports = (error, req, res, next) => {
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

    error.statusCode ||= 500;
    error.status ||= "error";

    if (process.env.NODE_ENV === "development") {
        sendDevelopmentError(error, res);
    } else if (process.env.NODE_ENV === "production") {
        let clonedError = { ...error };

        if (error instanceof MongooseErrors.CastError) {
            clonedError = handleCastErrorDB(error);
        } else if (error.code === 11000) {
            clonedError = handleDuplicateFieldDB(error);
        } else if (error instanceof MongooseErrors.ValidationError) {
            clonedError = handleValidationErrorDB(error);
        }

        sendProductionError(clonedError, res);
    }
};
