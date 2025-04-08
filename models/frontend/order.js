import {MongoDB} from '../../global.js';
import OrderSchema from './../../schemas/order.js';
import {log,toObjectId,getEnv} from './../../core/utils.js';
import datetime from './../../core/datetime.js';
import crypto from './../../core/crypto.js';

export default class OrderModel
{
    constructor(){
    this.model = MongoDB.db.model('order', OrderSchema);
    }



    async create(user_id,course_id,trans_id,price,type,title,slug){
        log('price'+price)
        if(!toObjectId(course_id))
            {
                return 0;
            }
        const date_time = datetime.toString();
        const expire_time= datetime.addDays(30).toString();
        const isDupOrder = await this.#checkOrder(user_id,course_id,trans_id);
        log('isDupOrder:'+isDupOrder)
        if(isDupOrder >0 )
        {
            return -1;
        }
        const row = new this.model({
            user_id,course_id,trans_id,price,type,title,slug,date_time,expire_time
        });
        const result = await row.save();
        return result;
        
    }

    async createFree(user_id,course_id,type,title,slug){
        if(!toObjectId(course_id))
        {
                return 0;
        }
        const date_time = datetime.toString();
        const isDupOrder = await this.#checkOrderForFree(user_id,course_id);
        if(isDupOrder >0 )
        {
            return -1;
        }
        const row = new this.model({
            user_id,course_id,price:"0",type,title,slug,date_time
        });
        const result = await row.save();
        return result;
        
    }


    async getOrderByUserId(userId){
        const orders = await this.model.find({"user_id":userId});

        let totalPrice = 0;
        for (const order of orders) {
            totalPrice += order.price || 0; // Safeguard against undefined `price`
        }
        return {
            user_id: userId,
            orders: orders,
            totalPrice: totalPrice
        };

    }
    async getOrderTypeByUserId(userId){
        const orders = await this.model.find({"user_id":userId}).select({"_id":0,"type":1});
        return orders;
        
    }

    async totalPriceByUserId(userId){
        return await this.model.aggregate([
            {
                $match: { user_id: toObjectId(userId) } // Replace USER_ID_HERE with the user's ObjectId
            },
            {
                $group: {
                    _id: "$user_id", // Group by user_id
                    orders: { $push: "$$ROOT" }, // Include all order details in an array
                    totalPrice: { $sum: "$price" } // Calculate the total price
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the group ID
                    user_id: "$_id", // Rename _id to user_id
                    orders: 1, // Keep the orders array
                    totalPrice: 1 // Keep the total price
                }
            }
        ]);

    }

    async getCountOrderByUserId(id){
        return await this.model.find({"user_id":id}).countDocuments();
    }

    async #checkOrder(user_id,course_id,trans_id){
        return await this.model.findOne({"user_id":user_id,"course_id":course_id,"trans_id":trans_id}).countDocuments();
    }

    
    async #checkOrderForFree(user_id,course_id){

        return await this.model.findOne({"user_id":user_id,"course_id":course_id}).countDocuments();
    }

    async checkExpireOrder(user_id,course_id){
        const x = await this.model.findOne({"user_id":user_id,"course_id":course_id});
        const currentDate = new Date();
        const expireDate = new Date(x.expire_time);
        if (currentDate > expireDate) {
            return true; // Order is expired
        } else {
            return false; // Order is not expired
        }
    }



    

   




}



 