import fs from 'fs'
import parse from 'csv-parse/lib/sync'
import db from '../setup/database'
import format from 'pg-format'

async function populate() {
	try {
		const csvInput = fs.readFileSync('./products.csv', 'utf8')
		console.log(csvInput)
		const records = parse(csvInput)
		console.log(records)
		records.shift() // removing first element
		const productsWithPriceInCents = records.map((record: any) => {
			return [ record[0], record[1].replace('.', ''), record[2]]
		})

		const sql = format('INSERT INTO products (name, price, quantity) VALUES %L', productsWithPriceInCents)
		console.log(sql)
		await db.query(sql, [])
		process.exit(0)
	} catch(err) {
		console.error(err)
		process.exit(0)
	}
}

populate()
