import { Request, Response } from 'express'
import db from '../../setup/database'
import { PgProductDAO, ProductDAO } from '../../db/productdao'
import { match } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

export async function getProductByName(req: Request, res: Response) {
	const { name } = req.params
	const productDAO = new ProductDAO(new PgProductDAO(db))
	try {
		const result = await handlerGetProduct(productDAO,name)
		res.status(result.status).json(result.body)
	} catch (err) {
		throw err // unknown error
	}
}

export async function handlerGetProduct(productDAO: ProductDAO, name: string) {
	const result = await productDAO.getProductByName(name)
	return pipe(result, match(
		(e) => { return {status: 404, body: e as any} },
		(product) => { return { status: 200, body: product } }
	))
}
