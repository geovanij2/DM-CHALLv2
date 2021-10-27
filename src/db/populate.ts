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
		// todo: mapear os valores de string para o formato correto
		const sql = format('INSERT INTO products (name, price, quantity) VALUES %L', records)
		console.log(sql)
		await db.query(sql, [])
	} catch(err) {
		console.error(err)
	}
}

populate()
