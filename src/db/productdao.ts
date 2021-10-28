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
		const res = await this.client.query('SELECT name, price, quantity FROM products WHERE name = $1', [name])
		if (res.rowCount === 0) {
			return left<'NotFound'>('NotFound')
		} else {
			return right(res.rows[0] as Product)
		}
	}

	async incrementProductQuantity(name: string) {
		const res = await this.client.query('UPDATE products SET quantity = quantity + 1 WHERE name = $1 RETURNING *', [name])
		if (res.rowCount === 0) {
			return left<'NotFound'>('NotFound')
		}
		return right(res.rows[0] as Product)
	}

	async decrementProductQuantity(name: string) {
		try {
			const res = await this.client.query('UPDATE products SET quantity = quantity - 1 WHERE name = $1 RETURNING *', [name])
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
	mockProductDB: Array<Product> = [
		{ product_id: 1, name: 'Banana', price: 5.62, quantity: 0 },
		{ product_id: 2, name: 'Alface', price: 3.47, quantity: 0 },
		{ product_id: 3, name: 'Cebola', price: 9.51, quantity: 0 }
	]

	async getProductByName(name: string) {
		for (let i = 0; i < this.mockProductDB.length; i++) {
			if (this.mockProductDB[i].name === name) {
				return right(this.mockProductDB[i])
			}
		}
		return left<'NotFound'>('NotFound')
	}

	async incrementProductQuantity(name: string) {
		for(let i = 0; i  < this.mockProductDB.length; i++) {
			if (this.mockProductDB[i].name === name) {
				this.mockProductDB[i].quantity += 1
				return right(this.mockProductDB[i])
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
				return right(this.mockProductDB[i])
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
