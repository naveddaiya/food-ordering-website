import axios from "axios"

const API = axios.create({
	// baseURL: "https://fooddelivery-mern.onrender.com/api/",
	baseURL: "http://localhost:8080/api/"
})

//auth
export const UserSignUp = async data => await API.post("/user/signup", data)
export const UserSignIn = async data => await API.post("/user/signin", data)

//products
export const getAllProducts = async filter => await API.get(`/food?${filter}`, filter)

export const getProductDetails = async id => await API.get(`/food/${id}`)

//Cart
export const getCart = async token =>
	await API.get(`/user/cart`, {
		headers: { Authorization: `Bearer ${token}` }
	})

export const addToCart = async (token, data) =>
	await API.post(`/user/cart/`, data, {
		headers: { Authorization: `Bearer ${token}` }
	})

export const deleteFromCart = async (token, data) =>
	await API.patch(`/user/cart/`, data, {
		headers: { Authorization: `Bearer ${token}` }
	})

//favorites

export const getFavourite = async token =>
	token
		? await API.get(`/user/favorite`, {
				headers: { Authorization: `Bearer ${token}` }
		  })
		: null

export const addToFavourite = async (token, data) =>
	await API.post(`/user/favorite/`, data, {
		headers: { Authorization: `Bearer ${token}` }
	})

export const deleteFromFavourite = async (token, data) =>
	await API.patch(`/user/favorite/`, data, {
		headers: { Authorization: `Bearer ${token}` }
	})

//Orders
export const placeOrder = async (token, data) =>
	await API.post(`/order/`, data, {
		headers: { Authorization: `Bearer ${token}` }
	})

export const getOrders = async token =>
	await API.get(`/order/`, {
		headers: { Authorization: `Bearer ${token}` }
	})