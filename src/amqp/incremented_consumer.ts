import { ProductDAO, PgProductDAO } from '../db/productdao'
import db from '../setup/database'

async function handlerIncremented(productDAO: ProductDAO, productName: string) {
    try {
        await productDAO.incrementProductQuantity(productName)
    } catch(e) {
        if (e === 'NotFound') {
            return // TODO: mudar para Either<L, R> e retornar um Either<L>
        }
        console.log(e) // log unexpected error
        return
    }
}

export function incrementedConsumer(channel: any) {
    const queue = 'incremented';
    const exchange = 'stock'
    const routingKey = 'incremented'

    channel.assertExchange('stock', 'direct', {
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
            
        await handlerIncremented(productDAO, productName)

        console.log(" [x] Received %s", msg.content.toString());
    }, {
        noAck: true
    })
}