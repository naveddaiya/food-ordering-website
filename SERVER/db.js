const mongoose = require("mongoose")

module.exports.connectDB = () => {
	mongoose.set("strictQuery", true)
	mongoose
		.connect(process.env.MONGODB_URL)
		.then(() => console.log("Connected to Mongo DB"))
		.catch(err => {
			console.error("failed to connect with mongo")
			console.error(err)
		})
}
