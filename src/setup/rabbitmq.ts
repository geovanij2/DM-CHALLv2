import * as amqp from 'amqplib/callback_api'
import { ProductDAO, PgProductDAO } from '../db/productdao'
import db from './database'

export function setupRabbitMQ() {
    amqp.connect('amqp://localhost:5672', function(error0: any, connection: any) {
        if (error0) {
            throw error0
        }
        connection.createChannel(function(error1: any, channel: any) {
            if (error1) {
                throw error1
            }

            var queue = 'stockQueue';

            channel.assertQueue(queue, {
                durable: true
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channel.consume(queue, async function(msg: any) {
                const productDAO = new ProductDAO(new PgProductDAO(db))
                const productName = msg.content.toString()

                if (msg.fields.exchange === 'stock' && msg.fields.routingKey === 'incremented') {
                    console.log('INCREMENTAR')
                    await handlerIncremented(productDAO, productName)
                    console.log('INCREMENTOU')
                }
                if (msg.fields.exchange === 'stock' && msg.fields.routingKey === 'decremented') {
                    console.log('DECREMENTAR')
                    await handlerDecremented(productDAO, productName)
                    console.log('DECREMENTOU')
                }

                console.log(" [x] Received %s", msg.content.toString());
            }, {
                noAck: true
            })
        })
    })
}

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