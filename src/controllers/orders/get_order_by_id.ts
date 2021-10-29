import { Request, Response } from 'express'
import db from '../../setup/database'
import { OrderDAO, PgOrderDAO } from '../../db/orderdao'
import { pipe } from 'fp-ts/function'
import { match } from 'fp-ts/Either'
import { containsOnlyDigits } from '../../validators'

export async function getOrderById(req: Request, res: Response) {
	const { id } = req.params
	const orderDAO = new OrderDAO(new PgOrderDAO(db))
	
	const { status, body } = await handlerGetOrder(orderDAO, id)
	res.status(status).json(body)
}

export async function handlerGetOrder(orderDAO: OrderDAO, id: any) {
	if (!containsOnlyDigits(id))
		return { status: 400, body: 'InvalidParams' }

	const result = await orderDAO.getOrder(id)

	return pipe(result, match(
		(e) => { return { status: 404, body: e as any } },
		(order) => { return { status: 200, body: order }}
	))
}