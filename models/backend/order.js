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



    async creat(user_id,title,type,price){
        const date_time = datetime.toString();
        const row = new this.model({
            user_id,title,type,price,date_time
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



    async pagination(page,sortField,sortType,title=''){
        const where = {};

        if(title !== '')
        {
            where['title'] = {$regex: '.*' + title + '.*', "$options": "i"};
        }
        const ROWS_PRE_PAGE = getEnv('ROWS_PRE_PAGE','number');
        const skip = Math.abs(ROWS_PRE_PAGE * page - ROWS_PRE_PAGE);
        const totalRows = await this.model.findOne(where).countDocuments();
        const totalPage = Math.ceil(totalRows / ROWS_PRE_PAGE);
        const rows =  await this.model.find(where).populate('user_id')
        .sort([[sortField,sortType]])
        .skip(skip)
        .limit(ROWS_PRE_PAGE);   
         return {
            rows,totalRows,totalPage
        };
    }


    async getCountAllOrder(){
        return await this.model.find({}).countDocuments();
    }

    async getTotalPrice(){
          const  x=  await this.model.aggregate([
                    {
                    $group: {
                        _id: null,
                        totalPrice: { $sum: "$price" }
                    }
                    }
                ])
                return x[0].totalPrice;
          
    }

    async getTotalPriceByMonth(){
        const  x=  await this.model.aggregate([
            {
              $project: {
                year: { $year: "$date_time" },
                month: { $month: "$date_time" },
                orderTotal: { $multiply: ["$price"] }
              }
            },
            {
              $group: {
                _id: { year: "$year", month: "$month" },
                monthlyIncome: { $sum: "$orderTotal" }
              }
            },
            {
              $sort: {
                "_id.year": 1,
                "_id.month": 1
              }
            }
          ])
          
            return x;

    }







}



 