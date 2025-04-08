// Producer (sender)
import amqp from'amqplib';
import {getEnv} from './utils.js'; 

const channelNames = [
  'sms-group',
  'sms-users',
  'sms-register',
  'sms-resetpass',
];
const channels = {};


class Amqp
{
  #url=getEnv('AMQP_URI')
  #amqp = null;



  get amqp()
  {
      return this.#amqp;
  }



  
  // Connect to RabbitMQ and create channels
  async  connectToRabbitMQ() {
    try {
      const rabbitMQUrl = amqp.connect(getEnv('AMQP_URI')); // Replace with your RabbitMQ URL if needed
      const connection = await amqp.connect(rabbitMQUrl);
      console.log('Connected to RabbitMQ');
  
      // Create a channel for each name
      for (const name of channelNames) {
        const channel = await connection.createChannel();
        console.log(`Channel "${name}" created`);
        channels[name] = channel;
  
        // Assert a queue for the channel
        await channel.assertQueue(name, { durable: true });
        console.log(`Queue "${name}" asserted in Channel "${name}"`);
      }
  
      // Gracefully handle process termination
      process.on('SIGINT', async () => {
        console.log('Closing RabbitMQ connection...');
        for (const name in channels) {
          await channels[name].close();
          console.log(`Channel "${name}" closed`);
        }
        await connection.close();
        console.log('RabbitMQ connection closed');
        //process.exit(0);
      });
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      return false;
    }
  }




  async  testRabbitMQConnection() {
    try {
      const connection = await amqp.connect(getEnv('AMQP_URI'));

      console.log('Successfully connected to RabbitMQ!');
      await connection.close(); // Close the connection after successful test
      return true;
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      return false;
    }
  }
  
  // async connect(URI)
  // {
  //     try{
  //         this.#URI = URI;
  //         const x  = new amqp.connect(this.#URI); // Replace with your RabbitMQ connection string
  //         //await this.#amqp;
  //         log('2323'+x)

  //         //log(this.#amqp)
          
  //     }
  //     catch(e){
  //         return false;
  //     }
  // }
    
    async  publishMessage(message,queueName) {
        try {
           const connection = await amqp.connect(getEnv('AMQP_URI'));  // Replace with your RabbitMQ server URL
          const channel = await connection.createChannel();
          await channel.assertQueue(queueName, { durable: true }); // Durable queue survives server restarts
      
          channel.sendToQueue(queueName, Buffer.from(message), { persistent: true }); // Persistent messages survive server restarts
          console.log(" [x] Sent '%s'", message);
      
          await channel.close();
          await connection.close();
        } catch (error) {
          console.error("Error publishing message:", error);
        }
      }

    async  consumeMessages(queueName) {
        try {
          const connection = await amqp.connect(getEnv('AMQP_URI')); // Replace with your RabbitMQ connection string
          const channel = await connection.createChannel();
          await channel.assertQueue(queueName, { durable: true });      
          console.log(" [*] Waiting for messages in %s. ", queueName);      
          channel.consume(queueName, (msg) => {
            if (msg !== null) {  // Check if msg is null (can happen during channel closure)
              console.log(" [x] Received '%s'", msg.content.toString());
              
               channel.ack(msg); // Acknowledge the message to remove it from the queue
                               // If you don't acknowledge, the message will be redelivered
                const data ={
                  "data" :msg.content
                }
                return data   
                
            } else {
              console.warn("Received null message, likely due to channel closure.");
            }
      
          }, { noAck: false }); // Manual acknowledgement
      

        } catch (error) {
          console.error("Error consuming messages:", error);
        }
    }


    // Function to send SMS messages to a specific channel
  async  sendSms(channelName, message) {
  try {
    if (!channels[channelName]) {
      throw new Error(`Channel "${channelName}" does not exist`);
    }

    // Convert the message to a Buffer and send it to the queue
    const channel = channels[channelName];
    channel.sendToQueue(channelName, Buffer.from(JSON.stringify(message)));
    console.log(`Message sent to channel "${channelName}":`, message);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}
   

}


export default Amqp;
