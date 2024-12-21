import React, { useEffect, useState } from "react"
import axios from "axios"
import { Container, Card, CardContent, Typography, Button, Grid } from "@mui/material"
import { styled } from "@mui/system"
import { getOrders } from "../api"

// Custom styled card for orders
const OrderCard = styled(Card)(({ theme }) => ({
	marginBottom: theme.spacing(2),
	padding: theme.spacing(2),
	backgroundColor: "#f9f9f9"
}))

const Orders = () => {
	const [orders, setOrders] = useState([])

	useEffect(() => {
		const token = localStorage.getItem("foodeli-app-token")
		const fetchOrders = async () => {
			try {
				const response = await getOrders(token)
				setOrders(response.data)
			} catch (error) {
				console.error("Error fetching orders:", error)
			}
		}

		fetchOrders()
	}, [])

	return (
		<Container>
			<Typography variant="h4" gutterBottom>
				Orders
			</Typography>
			<Grid container spacing={2}>
				{orders.map(order => (
					<Grid item xs={12} key={order._id}>
						<OrderCard>
							<CardContent>
								<table>
									<tr>
										<td>
											<Typography variant="h6">
												<b>Ordered On:</b>
											</Typography>
										</td>
										<td>
											<Typography variant="h6">
												{new Date(order.createdAt).toDateString()} at{" "}
												{new Date(order.createdAt).toLocaleTimeString()}
											</Typography>
										</td>
									</tr>
									<tr>
										<td>
											<Typography variant="body1">
												<b>Order ID:</b>
											</Typography>
										</td>
										<td>
											<Typography variant="body1">{order._id}</Typography>
										</td>
									</tr>
									<tr>
										<td>
											<Typography variant="body1">
												<b>Total Amount:</b>
											</Typography>
										</td>
										<td>
											<Typography variant="body1">
												<b>₹{order.total_amount}</b>
											</Typography>
										</td>
									</tr>
									<tr>
										<td>
											<Typography variant="body1">
												<b>Address:</b>
											</Typography>
										</td>
										<td>
											<Typography variant="body1">{order.address}</Typography>
										</td>
									</tr>
									<tr>
										<td>
											<Typography variant="body1">
												<b>Status:</b>
											</Typography>
										</td>
										<td>
											<Typography variant="body1"> {order.status}</Typography>
										</td>
									</tr>
									<tr>
										<td style={{ verticalAlign: "top" }}>
											<Typography variant="body1">
												<b>Products:</b>
											</Typography>
										</td>
										<td>
											<ul style={{ marginTop: "5px" }}>
												{order.products.map(productItem => (
													<li key={productItem.product}>
														<Typography variant="body2">
															Product: <b>{productItem.productName}</b>, Quantity: <b>{productItem.quantity}</b>
														</Typography>
													</li>
												))}
											</ul>
										</td>
									</tr>
								</table>

								{/* <Button variant="contained" color="primary">
									Reorder
								</Button> */}
							</CardContent>
						</OrderCard>
					</Grid>
				))}
			</Grid>
		</Container>
	)
}

export default Orders
