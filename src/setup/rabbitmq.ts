import * as amqp from 'amqplib/callback_api'
import { incrementedConsumer } from '../amqp/incremented_consumer'
import { decrementedConsumer } from '../amqp/decremented_consumer'

export async function setupRabbitMQ() {
    const channel = new Promise((resolve, _) => {
        amqp.connect('amqp://localhost:5672', function(error0: any, connection: any) {
            if (error0) {
                throw error0
            }
            connection.createChannel(function(error1: any, channel: any) {
                if (error1) {
                    throw error1
                }

                resolve(channel)
            })
        })
    })
    return await channel
}

export async function setupConsumers(channel: any) {
    incrementedConsumer(channel)
    decrementedConsumer(channel)
}