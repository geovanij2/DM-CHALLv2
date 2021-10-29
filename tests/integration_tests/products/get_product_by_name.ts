import { assert } from 'chai'
import { Express } from 'express'
import request from 'supertest'
import db from '../../../src/setup/database'
import { setupExpress } from '../../../src/setup/express'

describe('Get product by name', () => {
	let app: Express
	before('Mock db connection and load app', async () => {
		// can modify this line to create a new Pool()
		
		app = await setupExpress()
	})

	beforeEach('Create temporary tables', async () => {
		const client = await db.connect()
		await client.query('CREATE TEMPORARY TABLE products (LIKE products INCLUDING ALL)')
		client.release()
	})

	beforeEach('Add fake data to temporary table', async () => {
		const client = await db.connect()
		await client.query('INSERT INTO pg_temp.products (name, price, quantity) VALUES ($1, $2, $3)', ['Banana', 243, 3])
		await client.query('INSERT INTO pg_temp.products (name, price, quantity) VALUES ($1, $2, $3)', ['Alface', 177, 5])
		await client.query('INSERT INTO pg_temp.products (name, price, quantity) VALUES ($1, $2, $3)', ['Tomate', 466, 3])
		client.release()
	})


	afterEach('Drop temporary tables', async function () {
		const client = await db.connect()
		await client.query('DROP TABLE IF EXISTS pg_temp.products')
		client.release()
	})

	describe('GET /products/:name', () => {
		it('Should get right product', async () => {
			const res1 = await getProductByName('Banana', 200)
			const res2 = await getProductByName('Alface', 200)
			const res3 = await getProductByName('Tomate', 200)
			const expected1 = {
				name: 'Banana',
				price: 2.43,
				quantity: 3
			}
			const expected2 = {
				name: 'Alface',
				price: 1.77,
				quantity: 5
			}
			const expected3 = {
				name: 'Tomate',
				price: 4.66,
				quantity: 3
			}
			assert.deepEqual(res1, expected1)
			assert.deepEqual(res2, expected2)
			assert.deepEqual(res3, expected3)
		})
		it('Should return error NotFound with status 404', async () => {
			await getProductByName('NaoExiste', 404)
		})
	})
	async function getProductByName(name: any, status: number) {
		const { body } = await request(app)
			.get(`/products/${name}`)
			.expect(status)
		return body
	}
})
