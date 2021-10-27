import { Request, Response, Router } from 'express'
import * as products from './products'

function errorHandler(err: any, req: Request, res: Response) {
	console.log(err)
	res.status(500).end()
}

const router = Router()

products.register(router)

router.use(errorHandler)

export default router