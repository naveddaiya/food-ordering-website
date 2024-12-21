require("dotenv").config()
require("./db.js").connectDB()

const express = require("express")
const cors = require("cors")

const { catchError } = require("./error.js")
const UserRoutes = require("./routes/User.js")
const FoodRoutes = require("./routes/Food.js")
const OrderRoutes = require("./routes/Order.js")

const app = express()
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true }))

app.use("/api/user/", UserRoutes)
app.use("/api/food/", FoodRoutes)
app.use("/api/order/", OrderRoutes)
app.use(catchError)

app.listen(8080, () => console.log("Server started on port 8080"))
