import * as pg from 'pg'
import config from './config'

const db = new pg.Client({
	user: config.DB_USER,
	host: config.DB_HOST,
	database: config.DB_DATABASE,
	password: config.DB_PASSWORD,
	port: config.DB_PORT,
})

db.connect()

const NUMERIC_OID = 1700
pg.types.setTypeParser(NUMERIC_OID, val => { return parseFloat(val) })

export default db