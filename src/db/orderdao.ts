import { Client } from 'pg'
import { Product } from './productdao'

export class OrderDAO {
	dbHandler: OrderDBHandler

	constructor(dbHandler: OrderDBHandler) {
		this.dbHandler = dbHandler
	}

	async getAllOrders(): Promise<Array<Order>> {
		return await this.dbHandler.getAllOrders()
	}

	async getOrder(id: string): Promise<Order> {
		return await this.dbHandler.getOrder(id)
	}

	async createOrder(products: Array<ProductToBuy> ): Promise<Order> {
		return await this.dbHandler.createOrder(products)
	}
}

export class PgOrderDAO implements OrderDBHandler {
	client

	constructor(client: Client) {
		this.client = client
	}

	async getAllOrders() {
		const sql = `
			SELECT
				orders.order_id as id,
				name,
				amount as quantity,
				price,
				(amount * price) as subtotal
			FROM orders
			INNER JOIN orders_products 
				ON orders.order_id = orders_products.order_id
			INNER JOIN products
				ON products.product_id = orders_products.order_id`

		const res = await this.client.query(sql, [])

		const rows: JoinResult[] =  res.rows

		return formatAllOrders(rows)
	}

	async getOrder(id: string) {
		const sql = `
			SELECT
				orders.order_id as id,
				name,
				amount as quantity,
				price,
				(amount * price) as subtotal
			FROM orders
			INNER JOIN orders_products 
				ON orders.order_id = orders_products.order_id
			INNER JOIN products
				ON products.product_id = orders_products.order_id
			WHERE order_id = $1`

			const res = await this.client.query(sql, [id])

			if (res.rowCount === 0) {
				throw 'NotFound'
			}

			const rows: JoinResult[] = res.rows

			return formatOrder(rows)
	}

	async createOrder(products: Array<ProductToBuy> ) {
		try {
			await this.client.query('BEGIN')
			const res = await this.client.query('INSERT INTO orders (order_date) VALUES (now()) RETURNING order_id', [])
			const orderId: number = res.rows[0].order_id
			const prods = []
			let total = 0

			for (let i = 0; i < products.length; i++) {
				let sql = 'SELECT * FROM products WHERE name = $1 AND quantity >= $2'
				const res = await this.client.query(sql, [products[i].name, products[i].quantity])
				if (res.rowCount === 0) {
					throw 'NotFound'
				}
				const dbProduct = res.rows[0] as Product
				prods.push({ name: dbProduct.name, price: dbProduct.price, quantity: products[i].quantity })
				total += dbProduct.price * products[i].quantity

				sql = 'UPDATE products SET quantity = quantity - $1 WHERE product_id = $2'
				await this.client.query(sql, [products[i].quantity, dbProduct.product_id])

				sql = 'INSERT INTO orders_products (order_id, product_id, amount) VALUES ($1, $2, $3)'
				await this.client.query(sql, [orderId, dbProduct.product_id, products[i].quantity])
			}
			await this.client.query('COMMIT')

			return {
				id: orderId.toString(),
				products: prods,
				total,
			}
		} catch (e) {
			console.log(e)
			await this.client.query('ROLLBACK')
			throw e
		}
	}
}

function formatAllOrders(rows: Array<JoinResult>): Array<Order> {
	if (rows.length === 0) {
		return []
	}
	const orders = []

	let current_id = rows[0].id
	let current_products = []
	let current_total = 0

	for (let i = 0; i < rows.length; i++) {
		// id changed
		if (rows[i].id !== current_id) {
			// insert order in orders array and reset cursors
			orders.push({
				id: current_id.toString(),
				products: current_products,
				total: current_total,
			})
			current_id = rows[i].id
			current_total = 0
			current_products = []
		}
		current_total += rows[i].subtotal
		current_products.push({
			name: rows[i].name,
			quantity: rows[i].quantity,
			price: rows[i].price,
		})
	}
	// need to push last id
	orders.push({
		id: current_id.toString(),
		products: current_products,
		total: current_total,
	})

	return orders
}

function formatOrder(rows: Array<JoinResult>): Order {
	const products = []
	let total = 0
	for (let i = 0; i < rows.length; i++) {
		total += rows[i].subtotal
		products.push({
			name: rows[i].name,
			price: rows[i].price,
			quantity: rows[i].quantity
		})
	}
	return {
		id: rows[0].id.toString(),
		products,
		total,
	}
}

interface OrderDBHandler {
	client: any,
	getAllOrders: () => Promise<Array<Order>>
	getOrder: (id: string) => Promise<Order>
	createOrder: (products: Array<ProductToBuy>) => Promise<Order>
}

interface Order {
	id: string,
	products: Array<{name: string, price: number, quantity: number}>,
	total: number,
}

interface ProductToBuy {
	name: string,
	quantity: number,
}

interface JoinResult {
	id: number,
	name: string,
	quantity: number,
	price: number,
	subtotal: number,
}