const express = require("express")
const Order = require("../models/Order")
const User = require("../models/User")
const { verifyToken } = require("../middleware/verifyUser")
const { Types } = require("mongoose")
const router = express.Router()

router.get("/", verifyToken, async (req, res, next) => {
	try {
		const userJWT = req.user
		const orders = await Order.aggregate([
			{
				$match: {
					user: new Types.ObjectId(userJWT.id)
				}
			},
			{
				$lookup: {
					from: "foods",
					localField: "products.product",
					foreignField: "_id",
					pipeline: [
						{
							$project: {
								name: 1
							}
						}
					],
					as: "productNames"
				}
			}
		])

		for (const order of orders) {
			for (const product of order.products)
				product.productName = order.productNames?.find(i => i._id.toString() === product.product.toString())?.name
			delete order.productNames
		}

		return res.json(orders)
	} catch (err) {
		next(err)
	}
})

router.post("/", verifyToken, async (req, res, next) => {
	try {
		const { products, address, totalAmount } = req.body
		const userJWT = req.user
		const user = await User.findById(userJWT.id)

		const order = new Order({
			products,
			user: user._id,
			total_amount: totalAmount,
			address
		})

		await order.save()
		user.cart = []
		await user.save()
		return res.status(200).json({ message: "Order placed successfully", order })
	} catch (err) {
		next(err)
	}
})

module.exports = router
