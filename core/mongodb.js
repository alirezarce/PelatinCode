
import mongoose from 'mongoose';
import {log} from './utils.js';

class MongoDB
{
    #db = null;

    get db()
    {
        return this.#db;
    }

    async connect(URI){
        try{
            this.#db = await mongoose.createConnection(URI).asPromise();
            return true;
        }
        catch(e){
            log(`MongoDB Error : ${e.toString()}`);
            return false;
        }
    }

    async  findInAllCollections() {
        try {
          const objectId = new mongoose.Types.ObjectId(courseId); // Convert to ObjectId
          for (const collection of collections) {
            const model = mongoose.model(collection.name, new mongoose.Schema({}, { strict: false })); // Dynamic model
            const results = await model.find({ courseId: objectId });
      
            if (results.length > 0) {
              console.log(`Found in collection '${collection.name}':`, results);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          mongoose.disconnect();
        }
      }
      

}


export default MongoDB;