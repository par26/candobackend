const mongoose = require("mongoose");

process.on("uncaughtException", error => {
    console.error("ERROR: UNCAUGHT EXCEPTION! SHUTTING DOWN...");
    console.error(error.name, error.message);
    console.error(error.stack);

    process.exit(1);
});

const app = require("./app");

mongoose.set("strictQuery", false);

const mongoDbUrl = process.env.MONGO_DB_URL;

mongoose.connect(mongoDbUrl).then(() => {
    console.log("Successfully connected to database!");
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

process.on("unhandledRejection", error => {
    console.error("ERROR: UNHANDLED REJECTION. SHUTTING DOWN...");
    console.error(error.name, error.message);
    console.error(error.stack);
    server.close(() => {
        process.exit(1);
    });
});
