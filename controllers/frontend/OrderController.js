import FrontendController from "../../core/FrontendController.js";
import {Redis,Amqp} from "../../global.js";
import {log, getEnv,random,getPath,generateOtp,hasKey,generateOtpResetPassword} from '../../core/utils.js';
import crypto from '../../core/crypto.js';
import {validationResult,body} from 'express-validator';
import  UserModel from '../../models/frontend/user.js';
import  OrderModel from '../../models/frontend/order.js';
import  OnlineCourseModel from '../../models/frontend/onlineCourse.js';
import  OfflineCourseModel from '../../models/frontend/offlineCourse.js';
import  FaceToFaceCourseModel from '../../models/frontend/faceTofaceCourse.js';
import AqayePardakht from "../../core/aqayepardakht.js";
import axios from "axios";
const aqayepardakht =  new AqayePardakht("aqayepardakht");

export default class OrderController extends FrontendController
{
    #url =  getEnv('FRONTEND_URL') ;
    
    constructor()
    {
        super();
        this.model= new OrderModel();
        this.userModel = new UserModel();
        this.onlineCourseModel = new OnlineCourseModel();
        this.offlineCourseModel = new OfflineCourseModel();
        this.faceTofaceCourseModel = new FaceToFaceCourseModel();

    }

    async creat(req,res){
        try{
            const type = req.body.type;
            const slug = this.safeString(req.params.slug); 
            let backUrl = '';
            let orderCourse = null;
            switch(type)
            {
                case '1':
                    orderCourse = await this.onlineCourseModel.getCourse(slug);
                    backUrl = this.#url+'online-course-details'+'/'+slug+ '/?';
                break;
                case '2':
                    orderCourse = await this.offlineCourseModel.getCourse(slug);
                    backUrl = this.#url+'offline-course-details'+'/'+slug+ '/?';
                break;    
                case '3':
                    orderCourse = await this.faceTofaceCourseModel.getCourse(slug);
                    backUrl = this.#url+'face-to-face-course-details'+'/'+slug+ '/?';
                break;
                default:
                    return res.redirect(this.#url);
                break;

            }
            if(orderCourse == null)
            {
                return res.redirect(this.#url);
            }

           if(req?.session?.user_id)
           {
            if(orderCourse.price ==null || orderCourse.price =='0' ){
                const result= await this.model.createFree(req?.session?.user_id,orderCourse._id,type,orderCourse.title,orderCourse.slug);
                if(result._id) {
                    const userInfo = await this.userModel.getRow(req?.session?.user_id);
                if(type == 1){
                    const res_api=await axios
                    .post('https://www.skyroom.online/skyroom/api/apikey-31625588-6-052b7f494bab5ff1ffcb16c8b12bcee3',
                        {
                    "action": "addUserRooms",
                    params: {
                        "user_id": userInfo.skyRoomUser_id,
                        "rooms": [
                            { "room_id": orderCourse.skyRoom_id, "access": 1 }
                        ]}
                    });
                }
                    return res.redirect(`${backUrl}msg=success-add`);
                }
                else{
                    return res.redirect(`${backUrl}msg=err-add`);
                }
            } 
                const resultPay = await aqayepardakht.Create({ amount: orderCourse.price, callback: backUrl });
                if(resultPay?.data.status == 'success')
                {
                    return res.redirect(`https://panel.aqayepardakht.ir/startpay/${resultPay.data.transid}`);
                }
                else
                {
                    return res.redirect(`${backUrl}msg=pyment-error`);
                }
           }
           else
           {
                return res.redirect(`${backUrl}msg=user-not-login`);
           }
            
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }



    
   
}
