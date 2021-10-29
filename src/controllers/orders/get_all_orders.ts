import { Request, Response, NextFunction } from 'express'
import db from '../../setup/database'
import { OrderDAO, PgOrderDAO } from '../../db/orderdao'

export async function getAllOrders(req: Request, res: Response, next: NextFunction) {
	const orderDAO = new OrderDAO(new PgOrderDAO(db))
	
	try {
		const result = await handlerGetAllOrders(orderDAO)
		res.status(result.status).json(result.body)
	} catch(e) {
		next(e)
	}
}

export async function handlerGetAllOrders(orderDAO: OrderDAO) {
	const orders = await orderDAO.getAllOrders()
	return {
		status: 200,
		body: {orders}
	} 
}