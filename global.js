import Redis from "./core/redis.js";
import Amqp from "./core/amqp.js";
import MongoDB from "./core/mongodb.js";
const RedisObject = new Redis();
const MongoObject = new MongoDB();
const AmqpObject = new Amqp();


export {
    RedisObject as Redis,
    AmqpObject as Amqp,
    MongoObject as MongoDB
};