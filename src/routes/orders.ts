import { Router } from 'express'
import * as orders from '../handlers/orders'

export async function register(router: Router) {
	router.route('/orders')
		.post(orders.createOrder)
		.get(orders.getAllOrders)

	router.route('/orders/:id')
		.get(orders.getSingleOrder)
}