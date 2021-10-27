import { Client } from 'pg'

export class ProductDAO {
	dbHandler: ProductDBHandler

	constructor(dbHandler: ProductDBHandler) {
		this.dbHandler = dbHandler
	}

	async getProductByName(name: string): Promise<Product> {
		return await this.dbHandler.getProductByName(name)
	}
}

export class PgProductDAO implements ProductDBHandler {
	client: Client

	constructor(client: Client) {
		this.client = client
	}

	async getProductByName(name: string) {
		const res = await this.client.query('SELECT name, price, quantity FROM products WHERE name = $1', [name])
		if (res.rowCount === 0) {
			throw 'NotFound'
		} else {
			return res.rows[0] as Product
		}
	}
}

export class MockProductDAO implements ProductDBHandler {
	client = {}
	mockProductDB: Array<Product> = [
		{ product_id: 1, name: 'Banana', price: 5.62, quantity: 0 },
		{ product_id: 2, name: 'Alface', price: 3.47, quantity: 0 },
		{ product_id: 3, name: 'Cebola', price: 9.51, quantity: 0 }
	]

	async getProductByName(name: string) {
		for (let i = 0; i < this.mockProductDB.length; i++) {
			if (this.mockProductDB[i].name === name) {
				return this.mockProductDB[i]
			}
		}
		throw 'NotFound'
	}
}

export interface Product {
	product_id: number
	name: string,
	price: number,
	quantity: number,
}

interface ProductDBHandler {
	client: any,
	getProductByName: (name: string) => Promise<Product>
}
