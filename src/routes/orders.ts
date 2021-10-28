import { Router } from 'express'
import { createOrder } from '../controllers/orders/create_order'
import { getAllOrders } from '../controllers/orders/get_all_orders'
import { getOrderById } from '../controllers/orders/get_order_by_id'

export async function register(router: Router) {
	router.route('/orders')
		.post(createOrder)
		.get(getAllOrders)

	router.route('/orders/:id')
		.get(getOrderById)
}