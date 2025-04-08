const amqp = require('amqplib'); // Library to interact with RabbitMQ
const { MongoClient } = require('mongodb'); // Library to interact with MongoDB
const cron = require('node-cron'); // Library for scheduling tasks

// Configuration
const RABBITMQ_URL = 'amqp://localhost'; // RabbitMQ connection URL
const QUEUE_NAME = 'myqueue'; // RabbitMQ queue name
const MONGO_URL = 'mongodb://localhost:27017'; // MongoDB connection URL
const DATABASE_NAME = 'mydatabase'; // MongoDB database name
const COLLECTION_NAME = 'mycollection'; // MongoDB collection name

async function consumeAndInsert() {
  try {
    // Connect to RabbitMQ
    const rabbitConnection = await amqp.connect(RABBITMQ_URL);
    const channel = await rabbitConnection.createChannel();
    await channel.assertQueue(QUEUE_NAME);
    console.log(`Connected to RabbitMQ. Listening for messages on queue: "${QUEUE_NAME}"`);

    // Connect to MongoDB
    const mongoClient = new MongoClient(MONGO_URL);
    await mongoClient.connect();
    const database = mongoClient.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);
    console.log(`Connected to MongoDB. Using database "${DATABASE_NAME}" and collection "${COLLECTION_NAME}"`);

    // Consume messages from RabbitMQ
    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (msg !== null) {
          try {
            // Parse the RabbitMQ message
            const messageContent = msg.content.toString();
            const data = JSON.parse(messageContent); // Assuming messages are in JSON format
            console.log('Received message:', data);

            // Insert data into MongoDB
            const result = await collection.insertOne(data);
            console.log('Inserted into MongoDB:', result.insertedId);

            // Acknowledge message
            channel.ack(msg);
          } catch (error) {
            console.error('Error processing message:', error);

            // Negative acknowledgment in case of error
            channel.nack(msg);
          }
        }
      },
      { noAck: false } // Manual acknowledgment mode
    );
  } catch (error) {
    console.error('Error setting up RabbitMQ or MongoDB:', error);
  }
}

// Schedule the task to run every day at 8 PM
cron.schedule('0 20 * * *', () => {
  console.log('Starting message consumption at 8 PM...');
  consumeAndInsert();
});

console.log('Cron job scheduled. Waiting for 8 PM...');
