const { MongoClient } = require('mongodb');
const MONGO_URL = 'mongodb://localhost:27017'; // Replace with your MongoDB URL
const DATABASE_NAME = 'salek'; // Replace with your MongoDB database name
const COLLECTION_USERS = 'users'; // Replace with your MongoDB collection name
const COLLECTION_TXT_SMS = 'settings'; // Replace with your MongoDB collection name
const COLLECTION_SMS = 'sms'; // Replace with your MongoDB collection name
var Kavenegar = require('kavenegar');
var  api = Kavenegar.KavenegarApi({
  apikey: '4D7431566351727A70522F3049437878336B557A754968746F6A2B386671464F6243672F7149442F5037303D'
});


function replacePlaceholders(template, user) {
  return template
    .replace(/%firstname%/g, user.fn || '')
    .replace(/%lastname%/g, user.ln || '')
    .replace(/%mobile%/g, user.mobile || '');
}
const sendBirthdaySms = async () => { 
  try {
    // Connect to MongoDB  server
    const mongoClient = new MongoClient(MONGO_URL);
    await mongoClient.connect();
    const db = mongoClient.db(DATABASE_NAME);
    const collection_users = db.collection(COLLECTION_USERS);
    const collection_sms = db.collection(COLLECTION_SMS);
    // Get today's date (Month-Day format)
    const today = new Date();
    const todayMonthDay = `${today.getMonth() + 1}-${today.getDate()}`; // E.g., "1-24"
    console.log(todayMonthDay);
    var smsmTemplate= await db.collection(COLLECTION_TXT_SMS).find({}).toArray();
      const smsTemplate =smsmTemplate.map((item)=>item.content_birth);
      const txt = smsTemplate[0];
      if (!smsTemplate) {
        console.log("No SMS template found for birthdays.");
        return;
      }
  const getUser =  await collection_users.find({ "date_birth_ghamari": { $regex: todayMonthDay } },
       { projection: { "fn": 1, "ln": 1, "mobile": 1, "date_birth_ghamari": 1 } }).toArray();
    console.log(getUser);
      for (const user of getUser) {
        const phoneNumber =user.mobile;
        if (!phoneNumber) {
          console.log(`No phone number for user`);
          continue;
        }

      const personalizedMessage = replacePlaceholders(txt, user);
         api.Send({
           message: personalizedMessage,
           sender: "9982002441",
          receptor: phoneNumber
      },function(response, status) {
        console.log(response)
        console.log(status); 
        const mobile = response.map((item)=>item.receptor);   
        const message = response.map((item)=>item.message);   
       collection_sms.insertOne({"mobile":mobile[0],"status":status,"message":message[0],"type":"birthday"});     
         // console.log('Inserted into MongoDB:', result.insertedId);
     })};
  } catch (error) {
    console.error('Error publishing message:', error);
  }
};




sendBirthdaySms();
