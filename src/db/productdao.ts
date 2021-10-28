import { Client } from 'pg'
import { Either, left, right } from 'fp-ts/Either'
import { isConstraintError } from '../utils'

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
		const res = await this.client.query('SELECT name, round(price/100, 2) as price, quantity FROM products WHERE name = $1', [name])
		if (res.rowCount === 0) {
			return left<'NotFound'>('NotFound')
		} else {
			return right(res.rows[0] as Product)
		}
	}

	async incrementProductQuantity(name: string) {
		const res = await this.client.query('UPDATE products SET quantity = quantity + 1 WHERE name = $1 RETURNING name, round(price/100, 2) as price, quantity', [name])
		if (res.rowCount === 0) {
			return left<'NotFound'>('NotFound')
		}
		return right(res.rows[0] as Product)
	}

	async decrementProductQuantity(name: string) {
		try {
			const res = await this.client.query('UPDATE products SET quantity = quantity - 1 WHERE name = $1 RETURNING name, round(price/100, 2) as price, quantity', [name])
			if (res.rowCount === 0) {
				return left<'NotFound'>('NotFound')
			}
			return right(res.rows[0] as Product)
		} catch(e) {
			if (isConstraintError(e)){
				return left<'ConstraintError'>('ConstraintError')
			}
			throw e // unexpected db error
		}
	}
}

export class MockProductDAO implements ProductDBHandler {
	client = {}
	mockProductDB

	constructor(mockProductDB: Array<Product>) {
		this.mockProductDB = mockProductDB
	}

	async getProductByName(name: string) {
		for (let i = 0; i < this.mockProductDB.length; i++) {
			if (this.mockProductDB[i].name === name) {
				const ret = {
					product_id: this.mockProductDB[i].product_id,
					name: this.mockProductDB[i].name,
					price: this.mockProductDB[i].price / 100,
					quantity: this.mockProductDB[i].quantity,
				}
				return right(ret)
			}
		}
		return left<'NotFound'>('NotFound')
	}

	async incrementProductQuantity(name: string) {
		for(let i = 0; i  < this.mockProductDB.length; i++) {
			if (this.mockProductDB[i].name === name) {
				this.mockProductDB[i].quantity += 1
				const ret = {
					product_id: this.mockProductDB[i].product_id,
					name: this.mockProductDB[i].name,
					price: this.mockProductDB[i].price / 100,
					quantity: this.mockProductDB[i].quantity,
				}
				return right(ret)
			}
		}
		return left<'NotFound'>('NotFound')
	}

	async decrementProductQuantity(name: string) {
		for(let i = 0; i  < this.mockProductDB.length; i++) {
			if (this.mockProductDB[i].name === name) {
				if (this.mockProductDB[i].quantity === 0) {
					return left<'ConstraintError'>('ConstraintError')
				}
				this.mockProductDB[i].quantity -= 1
				const ret = {
					product_id: this.mockProductDB[i].product_id,
					name: this.mockProductDB[i].name,
					price: this.mockProductDB[i].price / 100,
					quantity: this.mockProductDB[i].quantity,
				}
				return right(ret)
			}
		}
		return left<'NotFound'>('NotFound')
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
	getProductByName: (name: string) => Promise<Either<'NotFound', Product>>,
	incrementProductQuantity: (name: string) => Promise<Either<'NotFound', Product>>,
	decrementProductQuantity: (name: string) => Promise<Either<'NotFound' | 'ConstraintError', Product>>,
}
