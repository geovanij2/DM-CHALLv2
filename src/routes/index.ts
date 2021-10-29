import { Request, Response, Router } from 'express'
import * as orders from './orders'
import * as products from './products'

function errorHandler(err: any, req: Request, res: Response) {
	console.error(err)
	res.status(500).end()
}

const router = Router()

orders.register(router)
products.register(router)

router.use(errorHandler)

export default router