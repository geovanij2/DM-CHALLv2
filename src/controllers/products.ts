import { Request, Response } from 'express'
import db from '../setup/database'
import { PgProductDAO, ProductDAO } from '../db/productdao'

export async function getSingleProductByName(req: Request, res: Response) {
	const { name } = req.params
	const productDAO = new ProductDAO(new PgProductDAO(db))
	try {
		const product = await productDAO.getProductByName(name)
		res.status(200).json(product)
	} catch (err) {
		if (err === 'NotFound') {
			res.status(404).end()
		}
	}
}
