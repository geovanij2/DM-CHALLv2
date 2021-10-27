import { Request, Response, Router } from 'express'

function errorHandler(err: any, req: Request, res: Response) {
	console.log(err)
	res.status(500).end()
}

const router = Router()

router.use(errorHandler)

export default router