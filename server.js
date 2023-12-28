const mongoose = require("mongoose");
const app = require("./app");

mongoose.set("strictQuery", false);

const mongoDbUrl =
	"mongodb+srv://pratush:fbla2022@cluster0.mgees8m.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoDbUrl).then(() => {
	console.log("Successfully connected to database!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
