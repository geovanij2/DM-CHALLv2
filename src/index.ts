import config from './setup/config'
import { setupExpress } from './setup/express'
import * as http from 'http'
import { setupRabbitMQ } from './setup/rabbitmq'

export async function main() {
	const app = await setupExpress()
	const server = http.createServer(app)
	setupRabbitMQ()
	server.listen(config.PORT, () => {
		console.warn(`SERVER LISTENING ON PORT: ${config.PORT}`)
	})
	return server
}

main()