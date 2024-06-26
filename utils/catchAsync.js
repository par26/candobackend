// Export a higher-order function that wraps an asynchronous function with error handling
module.exports = func => {
    return (req, res, next) => {
        // Call the provided function and catch any errors, passing them to the next middleware
        func(req, res, next).catch(next);
    };
};
