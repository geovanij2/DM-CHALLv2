import { ProductDAO, PgProductDAO } from '../db/productdao'
import db from '../setup/database'

async function handlerDecremented(productDAO: ProductDAO, productName: string) {
    try {
        await productDAO.decrementProductQuantity(productName)
    } catch(e) {
        if (e === 'NotFound') {
            return // TODO: mudar para Either<L, R> e retornar um Either<L>
        }
        if (e === 'ConstraintError') {
            return
        }
        console.log(e) // log unexpected error
        return
    }
}

export function decrementedConsumer(channel: any) {

    const queue = 'decremented';
    const exchange = 'stock'
    const routingKey = 'decremented'

    channel.assertExchange(exchange, 'direct', {
        durable: true
    })

    channel.assertQueue(queue, {
        durable: true
    });

    channel.bindQueue(queue, exchange, routingKey)

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, async function(msg: any) {
        const productDAO = new ProductDAO(new PgProductDAO(db))
        const productName = msg.content.toString()

        await handlerDecremented(productDAO, productName)

        console.log(" [x] Received %s", msg.content.toString());
    }, {
        noAck: true
    })
}