const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const express = require("express")
const { verifyToken } = require("../middleware/verifyUser.js")
const User = require("../models/User.js")
const { createError } = require("../error.js")

const router = express.Router()

router.post("/signup", async (req, res, next) => {
	try {
		const { email, password, name, img } = req.body

		//Check for existing user
		const existingUser = await User.findOne({ email }).exec()
		if (existingUser) {
			return next(createError(409, "Email is already in use."))
		}

		const salt = bcrypt.genSaltSync(10)
		const hashedPassword = bcrypt.hashSync(password, salt)

		const user = new User({
			name,
			email,
			password: hashedPassword,
			img
		})
		const createdUser = await user.save()
		const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
			expiresIn: "9999 years"
		})
		return res.status(201).json({ token, user })
	} catch (err) {
		next(err)
	}
})

router.post("/signin", async (req, res, next) => {
	try {
		const { email, password } = req.body

		//Check for existing user
		const user = await User.findOne({ email: email }).exec()
		if (!user) {
			return next(createError(409, "User not found."))
		}

		const isPasswordCorrect = await bcrypt.compareSync(password, user.password)
		if (!isPasswordCorrect) {
			return next(createError(403, "Incorrect password"))
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT, {
			expiresIn: "9999 years"
		})
		return res.status(200).json({ token, user })
	} catch (err) {
		next(err)
	}
})

router.post("/cart", verifyToken, async (req, res, next) => {
	try {
		const { productId, quantity } = req.body
		const userJWT = req.user
		const user = await User.findById(userJWT.id)
		const existingCartItemIndex = user.cart.findIndex(item => item.product.equals(productId))
		if (existingCartItemIndex !== -1) {
			// Product is already in the cart, update the quantity
			user.cart[existingCartItemIndex].quantity += quantity
		} else {
			// Product is not in the cart, add it
			user.cart.push({ product: productId, quantity })
		}
		await user.save()
		return res.status(200).json({ message: "Product added to cart successfully", user })
	} catch (err) {
		next(err)
	}
})

router.get("/cart", verifyToken, async (req, res, next) => {
	try {
		const userJWT = req.user
		const user = await User.findById(userJWT.id).populate({
			path: "cart.product",
			model: "Food"
		})
		const cartItems = user.cart
		return res.status(200).json(cartItems)
	} catch (err) {
		next(err)
	}
})

router.patch("/cart", verifyToken, async (req, res, next) => {
	try {
		const { productId, quantity } = req.body
		const userJWT = req.user
		const user = await User.findById(userJWT.id)
		if (!user) {
			return next(createError(404, "User not found"))
		}
		const productIndex = user.cart.findIndex(item => item.product.equals(productId))
		if (productIndex !== -1) {
			if (quantity && quantity > 0) {
				user.cart[productIndex].quantity -= quantity
				if (user.cart[productIndex].quantity <= 0) {
					user.cart.splice(productIndex, 1) // Remove the product from the cart
				}
			} else {
				user.cart.splice(productIndex, 1)
			}

			await user.save()

			return res.status(200).json({ message: "Product quantity updated in cart", user })
		} else {
			return next(createError(404, "Product not found in the user's cart"))
		}
	} catch (err) {
		next(err)
	}
})

router.post("/favorite", verifyToken, async (req, res, next) => {
	try {
		const { productId } = req.body
		const userJWT = req.user
		const user = await User.findById(userJWT.id)

		if (!user.favourites.includes(productId)) {
			user.favourites.push(productId)
			await user.save()
		}

		return res.status(200).json({ message: "Product added to favorites successfully", user })
	} catch (err) {
		next(err)
	}
})

router.get("/favorite", verifyToken, async (req, res, next) => {
	try {
		const userId = req.user.id
		const user = await User.findById(userId).populate("favourites").exec()
		if (!user) {
			return next(createError(404, "User not found"))
		}
		const favoriteProducts = user.favourites
		return res.status(200).json(favoriteProducts)
	} catch (err) {
		next(err)
	}
})

router.patch("/favorite", verifyToken, async (req, res, next) => {
	try {
		const { productId } = req.body
		const userJWT = req.user
		const user = await User.findById(userJWT.id)
		user.favourites = user.favourites.filter(fav => !fav.equals(productId))
		await user.save()

		return res.status(200).json({ message: "Product removed from favorites successfully", user })
	} catch (err) {
		next(err)
	}
})

module.exports = router
