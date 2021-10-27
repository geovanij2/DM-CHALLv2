import { Router } from 'express'
import * as orders from '../controllers/orders'

export async function register(router: Router) {
	router.route('/orders')
		.post(orders.createOrder)
		.get(orders.getAllOrders)

	router.route('/orders/:id')
		.get(orders.getSingleOrder)
}