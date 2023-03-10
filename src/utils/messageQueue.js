const amqplib = require('amqplib');

const { BROKER_URL, EXCHANGE_NAME } = require('../config/serverConfig');
const createChannel = async () => {
    try {
        console.log(BROKER_URL);
        const connection = await amqplib.connect(BROKER_URL);
        console.log(connection, '-----');
        const channel = await connection.createChannel();
        console.log(channel);
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
        return channel;
    } catch (error) {
        throw error;
    }
}

const publishMessage = async (channel, binding_key, message) => {
    try {
        await channel.assertQueue('QUEUE_NAME');

        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    } catch (error) {
        throw error;        
    }
}

const subscribeMessage = async (channel, service, binding_key) => {
    try {
        const applicationQueue = await channel.assertQueue('QUEUE_NAME');

        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);
        channel.consume(applicationQueue.queue, msg => {
            console.log('data received');
            console.log(msg.content.toString());
            channel.ack(msg);
    });
    } catch (error) {
        throw error;  
    }
}
module.exports = {
    createChannel,
    publishMessage,
    subscribeMessage
}