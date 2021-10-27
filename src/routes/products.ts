import { Router } from 'express'
import * as products from '../controllers/products'

export async function register(router: Router) {
	router.route('/products/:name')
		.get(products.getSingleProductByName)
}