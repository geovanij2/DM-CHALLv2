import { Pool } from 'pg'
import { Product } from './productdao'
import { Either, left, right } from 'fp-ts/Either'

export class OrderDAO {
	dbHandler: OrderDBHandler

	constructor(dbHandler: OrderDBHandler) {
		this.dbHandler = dbHandler
	}

	async getAllOrders() {
		return await this.dbHandler.getAllOrders()
	}

	async getOrder(id: string) {
		return await this.dbHandler.getOrder(id)
	}

	async createOrder(products: Array<ProductToBuy>) {
		return await this.dbHandler.createOrder(products)
	}
}

export class PgOrderDAO implements OrderDBHandler {
	pool

	constructor(pool: Pool) {
		this.pool = pool
	}

	async getAllOrders() {
		const client = await this.pool.connect()
		const sql = `
			SELECT
				orders.order_id as id,
				name,
				amount as quantity,
				round(price/100, 2) as price,
				(amount * price) as subtotal
			FROM orders
			INNER JOIN orders_products 
				ON orders.order_id = orders_products.order_id
			INNER JOIN products
				ON products.product_id = orders_products.product_id
			ORDER BY id ASC`

		try {
			const res = await client.query(sql, [])
			client.release()	
			const rows: JoinResult[] =  res.rows
			return formatAllOrders(rows)
		} catch(err) {
			client.release()
			throw err
		}
	}

	async getOrder(id: string) {
		const sql = `
			SELECT
				orders.order_id as id,
				name,
				amount as quantity,
				round(price/100,2) as price,
				(amount * price) as subtotal
			FROM orders
			INNER JOIN orders_products 
				ON orders.order_id = orders_products.order_id
			INNER JOIN products
				ON products.product_id = orders_products.product_id
			WHERE orders.order_id = $1`

		const client = await this.pool.connect()
		try{
			const res = await client.query(sql, [id])
			client.release()

			if (res.rowCount === 0) {
				return left<'NotFound'>('NotFound')
			}

			const rows: JoinResult[] = res.rows

			return right(formatOrder(rows))
		} catch(e) {
			client.release()
			throw e
		}
	}

	async createOrder(productsToBuy: Array<ProductToBuy> ) {
		const client = await this.pool.connect()
		try {
			for (let i = 0; i < productsToBuy.length; i++) {
				const sql = 'SELECT * FROM products WHERE name = $1'
				const res1 = await client.query(sql, [productsToBuy[i].name])
				if (res1.rowCount === 0) {
					return left<'NotFound'>('NotFound')
				}
				const dbProduct = res1.rows[0] as Product
				if (dbProduct.quantity < productsToBuy[i].quantity) {
					return left<'InvalidQuantity'>('InvalidQuantity')
				}
			} // if loop ends wihtout return order can be made

			await client.query('BEGIN')
			const res2 = await client.query('INSERT INTO orders (order_date) VALUES (now()) RETURNING order_id', [])
			const orderId = res2.rows[0].order_id

			for (let i = 0; i < productsToBuy.length; i++) {
				let sql = 'UPDATE products SET quantity = quantity - $1 WHERE name = $2 RETURNING product_id, name, price, round(price/100, 2) as roudedprice, quantity'
				const res3 = await client.query(sql, [productsToBuy[i].quantity, productsToBuy[i].name])
				const dbProduct = res3.rows[0] as Product & { roundedprice: number }

				sql = 'INSERT INTO orders_products (order_id, product_id, amount) VALUES ($1, $2, $3)'
				await client.query(sql, [orderId, dbProduct.product_id, productsToBuy[i].quantity])
			}
			await client.query('COMMIT')

			return await this.getOrder(orderId)	
		} catch (e) {
			await client.query('ROLLBACK')
			throw e
		} finally {
			client.release()
		}
	}
}

export class MockOrderDAO implements OrderDBHandler {
	mockProductDB
	mockOrderDB

	constructor(mockProductDB: Array<Product>, mockOrderDB: Array<Order>) {
		this.mockProductDB = mockProductDB
		this.mockOrderDB = mockOrderDB
	}

	async getOrder(id: string) {
		for (let i = 0; i < this.mockOrderDB.length; i++) {
			if (this.mockOrderDB[i].id === id) {
				return right(this.mockOrderDB[i])
			}
		}
		return left<'NotFound'>('NotFound')
	}

	async getAllOrders() {
		return this.mockOrderDB
	}

	async createOrder(products: Array<ProductToBuy>) {
		const ret: Order = {
			id: (this.mockOrderDB.length+1).toString(),
			products: [],
			total: 0,
		} 

		for (let i = 0; i < products.length; i++) {
			let found = false
			let index = -1
			// procura produto com mesmo nome na base
			for (let j = 0; j < this.mockProductDB.length; j++) {
				if (this.mockProductDB[j].name === products[i].name) { //achou produto no banco
					found = true
					index = j
				}
			}
			if (!found) {
				return left<'NotFound'>('NotFound')
			}
			if (this.mockProductDB[index].quantity < products[i].quantity) {
				return left<'InvalidQuantity'>('InvalidQuantity')
			}
			this.mockProductDB[index].quantity -= products[i].quantity
			ret.products.push({
				name: this.mockProductDB[index].name,
				price: this.mockProductDB[index].price / 100,
				quantity: products[i].quantity
			})
			ret.total += this.mockProductDB[index].price * products[i].quantity
		}
		//fix price format
		ret.total /= 100
		this.mockOrderDB.push(ret) // salva no banco
		return right(ret)
	}
}

export function formatAllOrders(rows: Array<JoinResult>): Array<Order> {
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
				total: current_total / 100,
			})
			current_id = rows[i].id
			current_total = 0
			current_products = []
		}
		current_total += rows[i].subtotal // in cents
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
		total: current_total / 100,
	})

	return orders
}

export function formatOrder(rows: Array<JoinResult>): Order {
	if (rows.length === 0) {
		throw 'InvalidParameter'
	}
	const products = []
	let total = 0
	for (let i = 0; i < rows.length; i++) {
		total += rows[i].subtotal // subtotal in cents
		products.push({
			name: rows[i].name,
			price: rows[i].price,
			quantity: rows[i].quantity
		})
	}
	return {
		id: rows[0].id.toString(),
		products,
		total: total/100,
	}
}

interface OrderDBHandler {
	getAllOrders: () => Promise<Array<Order>>
	getOrder: (id: string) => Promise<Either<'NotFound', Order>>
	createOrder: (products: Array<ProductToBuy>) => Promise<Either<'NotFound' | 'InvalidQuantity', Order>>
}

export interface Order {
	id: string,
	products: Array<{name: string, price: number, quantity: number}>,
	total: number,
}

interface ProductToBuy {
	name: string,
	quantity: number,
}

export interface JoinResult {
	id: number,
	name: string,
	quantity: number,
	price: number, // in R$
	subtotal: number, // in cents
}