import * as amqp from 'amqplib/callback_api'
import { ProductDAO, PgProductDAO } from '../db/productdao'
import db from './database'

export function setupRabbitMQ() {
    console.log('BANANA')
    amqp.connect('amqp://localhost:5672', function(error0: any, connection: any) {
        console.log('BANANA2')
        if (error0) {
            console.log('BANANA3')
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

            channel.consume(queue, function(msg: any) {
                const productDAO = new ProductDAO(new PgProductDAO(db))
                const productName = msg.content.toString()
                console.log(msg)
                if (msg.exchange === 'stock' && msg.rountingKey === 'incremented') {
                    handlerIncremented(productDAO, productName)
                }
                if (msg.exchange === 'stock' && msg.rountingKey === 'decremented') {
                    handlerDecremented(productDAO, productName)
                }

                console.log(" [x] Received %s", msg.content.toString());
            }, {
                noAck: true
            })
        })
    })
}

function handlerIncremented(productDAO: ProductDAO, productName: string) {
    try {
        productDAO.incrementProductQuantity(productName)
    } catch(e) {
        if (e === 'NotFound') {
            return // TODO: mudar para Either<L, R> e retornar um Either<L>
        }
        console.log(e) // log unexpected error
        return
    }
}

function handlerDecremented(productDAO: ProductDAO, productName: string) {
    try {
        productDAO.decrementProductQuantity(productName)
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