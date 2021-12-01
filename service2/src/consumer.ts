import amqplib from 'amqplib'

// Queue
export const QUEUE_CONNECTION_STRING = "amqp://ricqueue:ricqueue@localhost"
export const QUEUE_EXCHANGE_NAME = 'my:queue:direct'
export const QUEUE_EXCHANGE_TYPE = 'direct'
export const QUEUE_NAME = 'my:queue:action:create'




export const do_consume = async () => {
  const connection = amqplib.connect(QUEUE_CONNECTION_STRING)
  connection.then(async (conn) => {
    const channel = await conn.createChannel()
  
    console.log('Asserting channel')
    await channel.assertExchange(QUEUE_EXCHANGE_NAME, QUEUE_EXCHANGE_TYPE)
    await channel.assertQueue(QUEUE_NAME)
  
    console.log('Setting up consumer')
    channel.prefetch(1) // only get 1 mesage at a time..
    channel.consume(QUEUE_NAME, async (message) => {
      console.log('Received %s', message)
      try {
        const distributionMessage = message.content.toString()
  
        console.debug('Processing message:', distributionMessage)
        channel.ack(message)
      } catch (e) {
        console.log('++++++++++++++++++++++An error occured processing a message. Redelivery:', !message.fields.redelivered, e)
        channel.reject(message, !message.fields.redelivered)
      }
    }, { noAck: false })
  })
  
  }

