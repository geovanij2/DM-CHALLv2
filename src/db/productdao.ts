import { Client } from 'pg'

export class ProductDAO {
	dbHandler: ProductDBHandler

	constructor(dbHandler: ProductDBHandler) {
		this.dbHandler = dbHandler
	}

	async getProductByName(name: string) {
		return await this.dbHandler.getProductByName(name)
	}

	async incrementProductQuantity(name: string) {
		return await this.dbHandler.incrementProductQuantity(name)
	}

	async decrementProductQuantity(name: string) {
		return await this.dbHandler.decrementProductQuantity(name)
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

	async incrementProductQuantity(name: string) {
		const res = await this.client.query('UPDATE products SET quantity = quantity + 1 WHERE name = $1 RETURNING *', [name])
		if (res.rowCount === 0) {
			throw 'NotFound'
		}
		return res.rows[0] as Product
	}

	async decrementProductQuantity(name: string) {
		const res = await this.client.query('UPDATE products SET quantity = quantity - 1 WHERE name = $1 RETURNING *', [name])
		if (res.rowCount === 0) {
			throw 'NotFound'
		}
		return res.rows[0] as Product
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

	async incrementProductQuantity(name: string) {
		for(let i = 0; i  < this.mockProductDB.length; i++) {
			if (this.mockProductDB[i].name === name) {
				this.mockProductDB[i].quantity += 1
				return this.mockProductDB[i]
			}
		}
		throw 'NotFound'
	}

	async decrementProductQuantity(name: string) {
		for(let i = 0; i  < this.mockProductDB.length; i++) {
			if (this.mockProductDB[i].name === name) {
				if (this.mockProductDB[i].quantity === 0) {
					throw 'ConstraintError'
				}
				this.mockProductDB[i].quantity -= 1
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
	getProductByName: (name: string) => Promise<Product>,
	incrementProductQuantity: (name: string) => Promise<Product>,
	decrementProductQuantity: (name: string) => Promise<Product>,
}
