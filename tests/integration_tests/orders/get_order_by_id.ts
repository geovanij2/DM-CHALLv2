import { assert } from 'chai'
import { Express } from 'express'
import request from 'supertest'
import db from '../../../src/setup/database'
import { setupExpress } from '../../../src/setup/express'

describe('Get order by id', () => {
	let app: Express
	before('Set up express', async () => {
		app = await setupExpress()
	})

	beforeEach('Create temporary tables', async () => {
		const client = await db.connect()
		await client.query('CREATE TEMPORARY TABLE products (LIKE products INCLUDING ALL)')
		await client.query('CREATE TEMPORARY TABLE orders (LIKE orders INCLUDING ALL)')
		await client.query('CREATE TEMPORARY TABLE orders_products (LIKE orders_products INCLUDING ALL)')
		client.release()
	})

	beforeEach('Add fake data to temporary table', async () => {
		const client = await db.connect()
		let res = await client.query('INSERT INTO pg_temp.products (name, price, quantity) VALUES ($1, $2, $3) RETURNING product_id', ['Banana', 243, 3])
		const p_id1 = res.rows[0].product_id
		res = await client.query('INSERT INTO pg_temp.products (name, price, quantity) VALUES ($1, $2, $3) RETURNING product_id', ['Alface', 177, 5])
		const p_id2 = res.rows[0].product_id
		res = await client.query('INSERT INTO pg_temp.products (name, price, quantity) VALUES ($1, $2, $3) RETURNING product_id', ['Tomate', 466, 3])
		//const p_id3 = res.rows[0].product_id

		res = await client.query('INSERT INTO pg_temp.orders VALUES (DEFAULT, DEFAULT) RETURNING order_id')
		const o_id1 = res.rows[0].order_id
		await client.query('INSERT INTO pg_temp.orders_products (order_id, product_id, amount) VALUES ($1, $2, $3)', [o_id1, p_id1, 5])

		res = await client.query('INSERT INTO pg_temp.orders VALUES (DEFAULT, DEFAULT) RETURNING order_id')
		const o_id2 = res.rows[0].order_id
		await client.query('INSERT INTO pg_temp.orders_products (order_id, product_id, amount) VALUES ($1, $2, $3)', [o_id2, p_id1, 2])
		await client.query('INSERT INTO pg_temp.orders_products (order_id, product_id, amount) VALUES ($1, $2, $3)', [o_id2, p_id2, 1])
		client.release()
	})

	afterEach('Drop temporary tables', async function () {
		const client = await db.connect()
		await client.query('DROP TABLE IF EXISTS pg_temp.orders_products')
		await client.query('DROP TABLE IF EXISTS pg_temp.orders')
		await client.query('DROP TABLE IF EXISTS pg_temp.products')
		client.release()
	})

	describe('GET /orders/:id', () => {
		it('Should get right product', async () => {
			const client = await db.connect()
			const sql = 'SELECT order_id FROM orders ORDER BY order_id ASC'
			let res = await client.query(sql)
			client.release()

			const res1 = await getOrderById(res.rows[0].order_id, 200)
			const expected1 = {
				id: res.rows[0].order_id.toString(),
				products: [
					{
						name: 'Banana',
						price: 2.43,
						quantity: 5
					}
				],
				total: 12.15
			}

			const res2 = await getOrderById(res.rows[1].order_id, 200)
			const expected2 = {
				id: res.rows[1].order_id.toString(),
				products: [
					{
						name: 'Banana',
						price: 2.43,
						quantity: 2
					},
					{
						name: 'Alface',
						price: 1.77,
						quantity: 1
					}
				],
				total: 6.63
			}

			assert.deepEqual(res1, expected1)
			assert.deepEqual(res2, expected2)
		})
		it('Should return error NotFound with status 404', async () => {
			const client = await db.connect()
			const sql = 'SELECT order_id FROM orders ORDER BY order_id ASC'
			let res = await client.query(sql)
			client.release()

			await getOrderById(res.rows[1].order_id+1, 404)
		})
		it('Should return error InvalidParams with status 400', async () => {
			await getOrderById('dsafsafa', 400)
			await getOrderById('0124agag', 400)
			await getOrderById('gagfa222', 400)
		})
	})
	async function getOrderById(id: any, status: number) {
		const { body } = await request(app)
			.get(`/orders/${id}`)
			.expect(status)
		return body
	}
})