const amqp = require('amqplib');
const { MongoClient} = require('mongodb');
var ObjectId = require('mongodb').ObjectId; 

const mongoose = require('mongoose');
var Kavenegar = require('kavenegar');
const { use } = require('i18next');
var  api = Kavenegar.KavenegarApi({
  apikey: '4D7431566351727A70522F3049437878336B557A754968746F6A2B386671464F6243672F7149442F5037303D'
});

// RabbitMQ and MongoDB connection details
const RABBITMQ_URL = 'amqp://guest:guest@localhost:5672'; // Replace with your RabbitMQ URL
const MONGO_URL = 'mongodb://localhost:27017'; // Replace with your MongoDB URL
const QUEUE_NAME = 'sms-users'; // Replace with your RabbitMQ queue name
const DATABASE_NAME = 'salek'; // Replace with your MongoDB database name
const COLLECTION_NAME = 'sms'; // Replace with your MongoDB collection name
const COLLECTION_USERS = 'users'; // Replace with your MongoDB collection name

async function consumeAndInsert() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);
    console.log(`Connected to RabbitMQ, waiting for messages in queue: ${QUEUE_NAME}`);

    // Connect to MongoDB
    const mongoClient = new MongoClient(MONGO_URL);
    await mongoClient.connect();
    const db = mongoClient.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const collection_users = db.collection(COLLECTION_USERS);
    console.log(`Connected to MongoDB, using collection: ${COLLECTION_NAME}`);

    // Consume messages from the RabbitMQ queue
    channel.consume(
      QUEUE_NAME,
      async (message) => {
        if (message !== null) {
           try {
            const data = JSON.parse(message.content.toString()); // Parse the message
            if(!data.mobile){
              return console.log(' user is  not exist')
            }
              api.Send({
                message: data.message,
                sender: "9982002441",
              receptor: data.mobile
              }, function(response, status) {
                console.log(response);
                console.log(status);
              });
              const result = await collection.insertOne({"message":data.message,"mobile":data.mobile,"timestamp":data.timestamp,"type":data.type});
              console.log('Inserted into MongoDB:', result.insertedId);
            channel.ack(message);
          } catch (err) {
            console.error('Error processing message:', err);
            channel.nack(message); // Negative acknowledgment in case of an error
          }
        }
      },
      { noAck: false } // Ensure messages are acknowledged manually
    );
  } catch (err) {
    console.error('Error:', err);
  }
}

consumeAndInsert();
