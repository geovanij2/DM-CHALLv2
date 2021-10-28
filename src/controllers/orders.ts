import { Request, Response } from 'express'
import db from '../setup/database'
import { OrderDAO, PgOrderDAO } from '../db/orderdao'
import { isCreateOrderBody } from '../validators'
import { pipe } from 'fp-ts/function'
import { match } from 'fp-ts/Either'

export async function getAllOrders(req: Request, res: Response) {
	const orderDAO = new OrderDAO(new PgOrderDAO(db))
	
	const result = await handlerGetAllOrders(orderDAO)
	res.status(result.status).json(result.body)
}

export async function handlerGetAllOrders(orderDAO: OrderDAO) {
	const orders = await orderDAO.getAllOrders()
	return {
		status: 200,
		body: {orders}
	} 
}
	
export async function getSingleOrder(req: Request, res: Response) {
	const { id } = req.params
	const orderDAO = new OrderDAO(new PgOrderDAO(db))

	const { status, body } = await handlerGetSingleOrder(orderDAO, id)
	res.status(status).json(body)
}

export async function handlerGetSingleOrder(orderDAO: OrderDAO, id: string) {
	const result = await orderDAO.getOrder(id)

	return pipe(result, match(
		(e) => { return { status: 404, body: e as any } },
		(order) => { return { status: 200, body: order }}
	))
}

export async function createOrder(req: Request, res: Response) {
	const { products } = req.body
	const orderDAO = new OrderDAO(new PgOrderDAO(db))

	const { status, body } = await handlerCreateOrder(orderDAO, products)
	res.status(status).json(body)
}

export async function handlerCreateOrder(orderDAO: OrderDAO, products: any) {
	if(!isCreateOrderBody(products)) {
		return { status: 400, body: { error: 'InvalidParams' } }
	}
	const result = await orderDAO.createOrder(products)
	return pipe(result, match(
		(e) => { return { status: 404, body: e as any } },
		(order) => { return { status: 200, body: order } }
	))
}
