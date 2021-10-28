import { Request, Response } from 'express'
import db from '../../setup/database'
import { OrderDAO, PgOrderDAO } from '../../db/orderdao'

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