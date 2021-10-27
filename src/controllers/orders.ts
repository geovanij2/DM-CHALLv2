import { Request, Response } from 'express'
import db from '../setup/database'

export async function getAllOrders(req: Request, res: Response) {
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
	ORDER BY orders.orders_id ASC
	`
	const dbResult = await db.query(sql, [])
	const { rows } = dbResult
	const orders = [] // return object

	let current_id = rows[0].id
	let current_total = 0
	let current_products = []
	for (let i = 0; i < rows.length; i++) {
		if (rows[i].id !== current_id) { // new order, save the old one to the return object and update cursors
			orders.push({
				id: current_id,
				products: current_products,
				total: current_total
			})
			current_id = rows[i].id
			current_total = 0
			current_products = []
		} 
		current_total += rows[i].subtotal
		current_products.push({
			name: rows[i].name,
			quantity: rows[i].quantity,
			price: rows[i].price
		})
	}
	// need to push last id that the for loop didnt catch
	orders.push({
		id: current_id,
		products: current_products,
		total: current_total
	})

	res.status(200).json(orders)
}

export async function getSingleOrder(req: Request, res: Response) {
	const { id } = req.params

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

	try {
		const dbResult = await db.query(sql, [id])
		const { rows } = dbResult
		let total = 0
		rows.map(e => {
			total += e.subtotal
			return {
				name: e.name,
				quantity: e.quantity,
				price: e.price
			}
		})
		res.status(200).json({id, products: rows, total})
	} catch(err) {
		console.log(err)
		res.status(400).end()
	}
}

export async function createOrder(req: Request, res: Response) {
	// body: { products: Array<{name: string, quantity: number}>}
	// dentro de uma transacao checar para cada produto se existe a quantidade solicitada no banco
	// se nao existir abortar a transacao e retornar erro
	// se existir inserir row na tabela order e para cada produto inserir uma row na tabela order_product
	// fazer update das quantidades de cada produto

	// criar uma order no banco
	// para cada produto fazer um update da quantidade retornando o id do produto OTIMIZAÇAO: fazer update com condição
	// inserir em bulk na tabela orders product
	const { products }: { products: Array<{name: string, quantity: number}>} = req.body

	try {
		await db.query('BEGIN')
		const dbResult = await db.query('INSERT INTO orders (order_date) VALUES (now()) RETURNING order_id', [])
		const orderId = dbResult.rows[0].order_id

		for (let i = 0; i < products.length; i++) {
			let sql = 'SELECT * FROM products WHERE name = $1 AND quantity >= $2'
			const dbResult = await db.query(sql, [products[i].name, products[i].quantity])
			if (dbResult.rowCount === 0) {
				// throw error
			}
			const dbProduct = dbResult.rows[0]

			sql = 'UPDATE products SET quantity = quantity - $1 WHERE product_id = $2'
			await db.query(sql, [products[i].quantity, dbProduct.product_id])

			sql = 'INSERT INTO orders_products (order_id, product_id, amount) VALUES ($1, $2, $3)'
			await db.query(sql, [orderId, dbProduct.product_id, products[i].quantity])
		}
		await db.query('COMMIT')
	} catch (e) {
		console.log(e)
		await db.query('ROLLBACK')
		res.status(400).end()
	}
	res.status(200).end()
}
