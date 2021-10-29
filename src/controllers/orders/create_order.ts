import { Request, Response, NextFunction } from 'express'
import db from '../../setup/database'
import { OrderDAO, PgOrderDAO } from '../../db/orderdao'
import { isCreateOrderBody } from '../../validators'
import { pipe } from 'fp-ts/function'
import { match } from 'fp-ts/Either'

export async function createOrder(req: Request, res: Response, next: NextFunction) {
	const { products } = req.body
	const orderDAO = new OrderDAO(new PgOrderDAO(db))

	try {
		const { status, body } = await handlerCreateOrder(orderDAO, products)
		res.status(status).json(body)
	} catch(err) {
		next(err)
	}
}

export async function handlerCreateOrder(orderDAO: OrderDAO, products: any) {
	if(!isCreateOrderBody(products)) {
		return { status: 400, body: 'InvalidParams' }
	}
	const result = await orderDAO.createOrder(products)
	return pipe(result, match(
		(e) => { 
			switch(e) {
				case 'NotFound': return { status: 404, body: e as any }
				case 'InvalidQuantity': return { status: 400, body: e as any }
			}
		},
		(order) => { return { status: 200, body: order } }
	))
}