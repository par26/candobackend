const mongoose = require("mongoose");
const app = require("./app");

mongoose.set("strictQuery", false);

const mongoDbUrl = process.env.MONGO_DB_URL;

mongoose.connect(mongoDbUrl).then(() => {
	console.log("Successfully connected to database!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
