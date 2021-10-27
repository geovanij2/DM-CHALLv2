import { Request, Response } from 'express'
import db from '../setup/database'

export async function getSingleProductByName(req: Request, res: Response) {
	const { name } = req.params
	try {
		const dbResult = await db.query('SELECT name, price, quantity FROM products WHERE name = $1', [name])
		console.log(dbResult)
		if (dbResult.rowCount == 0) {
			res.status(200).json({})
		} else { //1 because product name is unique on DB
			res.status(200).json(dbResult.rows[0])
		}
	} catch (err) {
		res.status(400).end()
	}
}
