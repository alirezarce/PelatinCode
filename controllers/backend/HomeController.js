import BackendController from "../../core/BackendController.js";
import translate from "../../core/translate.js";
import {log, getEnv, toJSON} from '../../core/utils.js';
import UserModel from '../../models/backend/users.js';
import OrderModel from '../../models/backend/order.js';
import { get } from "mongoose";
import { json } from "express";


export default class HomeController extends BackendController
{
    #url =  getEnv('BACKEND_URL') + 'home/';

    constructor()
    {
        super();
        this.model = null;
        this.userModel= new UserModel();
        this.orderModel= new OrderModel();

    }
    
    async getIndex(req,res){
        try{
            const getAllUser= await this.userModel.getCountAllUser();
            const getAllUserActive= await this.userModel.getCountAllUserActive();
            const getAllOrder = await this.orderModel.getCountAllOrder();
            const totalPrice = await this.orderModel.getTotalPrice();
            const getTotalPriceByMonth = await this.orderModel.getTotalPriceByMonth();
            console.log(getTotalPriceByMonth);
            const data = {
                "title" : translate.t("home.page_title"),
                "allUsers":getAllUser,
                "activeUsers":getAllUserActive,
                "allOrder":getAllOrder,
                "totalPrice":totalPrice,
                "getTotalPriceByMonth":getTotalPriceByMonth,
            }
           
            
            
            return res.render(this.templatePath+'home/index',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }






}
