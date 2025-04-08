import FrontendController from "../../core/FrontendController.js";
import translate from "../../core/translate.js";
import {log, getEnv} from '../../core/utils.js';
import OnlineCourseModel from '../../models/frontend/onlineCourse.js';
import AqayePardakht from "../../core/aqayepardakht.js";
import axios from "axios";
const aqayepardakht =  new AqayePardakht("aqayepardakht");
import  UserModel from '../../models/frontend/user.js';
import  OrderModel from '../../models/frontend/order.js';


export default class OnlineCourseController extends FrontendController
{
    #url =  getEnv('FRONTEND_URL');

    constructor()
    {
        super();
        this.model = new OnlineCourseModel();
        this.orderModel = new OrderModel();
        this.userModel = new UserModel();
    }
    
    async getIndex(req,res){
        try{
           log('Get OnlineCourse-details');
           const userInfo = await this.userModel.getRow(req?.session?.user_id);
            const slug = this.safeString(req.params.slug);
            const course = await this.model.getCourse(slug);
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
            const getSettings = await this.globalModel.getSettings();
            const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
            const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
            const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
            if(!course)
            {
                return res.redirect(this.#url);
            }
            const data = {
                "title" : course.title_seo,
                "seo" : course.title_seo,
                "userInfo":userInfo,
                "allCategoryBlog" : getAllCategoryBlog,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                "setting":getSettings,
                "description_seo" : course.description_seo,
                "course" : course,
            };  
            return res.render(this.templatePath + 'onlineCourses/course.html',data);           
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async postIndex(req,res){
        let course = null;
        try{
            const slug = this.safeString(req.params.slug);
            course = await this.model.getCourse(slug);
            if(!course)
            {
                return res.redirect(`${this.#url}?msg=course-not-found`);
            }
            if(!req?.session?.user_id)
            {   
                return res.redirect(`${this.#url}?msg=user-not-login`);
            }  
 
            const userInfo = await this.userModel.getRow(req?.session?.user_id);
            const resultVeryfyPay = await aqayepardakht.Verify({ amount: course.price,transid: req.body.transid});
            log(resultVeryfyPay);
            if(resultVeryfyPay.data.code == '1')
            {
                //add order to mongodb
                const type='1';
                const result= await this.orderModel.create(req?.session?.user_id,course._id,req.body.transid,course.price,type,course.title,course.slug);
                if(result._id)
                {
                    //addUser IN room with sky room api 
                    const res_api=await axios
                    .post('https://www.skyroom.online/skyroom/api/apikey-31625588-6-052b7f494bab5ff1ffcb16c8b12bcee3',
                        {
                    "action": "addUserRooms",
                    params: {
                        "user_id": userInfo.skyRoomUser_id,
                        "rooms": [
                            { "room_id": course.skyRoom_id, "access": 1 }
                        ]}
                    });
                    return res.redirect(`${this.#url}online-course-details/${course.slug}?msg=pyment-success`);
                }
                else{
                return res.redirect(`${this.#url}online-course-details/${course.slug}?msg=pyment-isdup`);
                }
            }
            else
            {
                return res.redirect(`${this.#url}online-course-details/${course.slug}?msg=pyment-not-success`);
            }
        }
        catch(e){
            return res.redirect(`${this.#url}online-course-details/${course.slug}?msg=pyment-error`);
        }
    }

    async getCount(category_id){
        try{
            return await this.model.getCount(category_id);
        }
        catch(e){
            return e.toString();
        }
    }

}
