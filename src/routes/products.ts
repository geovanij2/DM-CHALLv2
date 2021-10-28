import { Router } from 'express'
import { getProductByName } from '../controllers/products/get_product_by_name'

export async function register(router: Router) {
	router.route('/products/:name')
		.get(getProductByName)
}