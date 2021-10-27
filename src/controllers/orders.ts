import { Request, Response } from 'express'
import db from '../setup/database'
import { OrderDAO, PgOrderDAO } from '../db/orderdao'
import { isCreateOrderBody } from '../validators'

export async function getAllOrders(req: Request, res: Response) {
	const orderDAO = new OrderDAO(new PgOrderDAO(db))
	try {
		const orders = await orderDAO.getAllOrders()
		res.status(200).json({orders})
	} catch(e) {
		throw e // not expecting a known error
	}
}

export async function getSingleOrder(req: Request, res: Response) {
	const { id } = req.params

	const orderDAO = new OrderDAO(new PgOrderDAO(db))

	try {
		const order = await orderDAO.getOrder(id)
		res.status(200).json(order)
	} catch(e) {
		if (e === 'NotFound') {
			res.status(404).end()
			return
		}
		throw e
	}
}

export async function createOrder(req: Request, res: Response) {
	const { products } = req.body
	const orderDAO = new OrderDAO(new PgOrderDAO(db))

	try {

		if(!isCreateOrderBody(products)) {
			throw 'InvalidParams'
		}
		const order = await orderDAO.createOrder(products)
		res.status(200).json(order)
	} catch(e) {
		if (e === 'NotFound') {
			res.status(404).end()
			return
		}
		if (e === 'InvalidParams') {
			res.status(400).end()
			return
		}
		throw e
	}
}
