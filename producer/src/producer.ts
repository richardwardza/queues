import amqplib from 'amqplib'

// Queue

export const QUEUE_CONNECTION_STRING = "amqp://ricqueue:ricqueue@localhost"
export const QUEUE_EXCHANGE_NAME = 'my:queue:direct'
export const QUEUE_EXCHANGE_TYPE = 'direct'
export const DESTINATION_QUEUE_NAME = 'my:queue:action:delete'



export const do_produce = async () => {
  const connection = amqplib.connect(QUEUE_CONNECTION_STRING)
  connection.then(async (conn) => {
    const channel = await conn.createChannel();

    const msg = {
      messageType: 'QUOTE_ACCEPTED',
      payload: {},
    }

    await channel.assertExchange(QUEUE_EXCHANGE_NAME, QUEUE_EXCHANGE_TYPE)
    channel.assertQueue(DESTINATION_QUEUE_NAME, { durable: true })
    channel.sendToQueue(DESTINATION_QUEUE_NAME, Buffer.from(JSON.stringify(msg)), { persistent: true })
    console.log('Sent')
    console.log(msg)
    console.log("Closing channel")
    setTimeout(() => {
      channel.close()
      console.log('Closing queue connection')
      conn.close()
    }, 1000)
  })

}

