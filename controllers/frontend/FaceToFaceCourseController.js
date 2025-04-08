import FrontendController from "../../core/FrontendController.js";
import translate from "../../core/translate.js";
import {log, getEnv} from '../../core/utils.js';
import FaceToFaceCourseModel from '../../models/frontend/faceTofaceCourse.js';
import  OrderModel from '../../models/frontend/order.js';
import  UserModel from '../../models/frontend/user.js';
import AqayePardakht from "../../core/aqayepardakht.js";
import axios from "axios";
const aqayepardakht =  new AqayePardakht("aqayepardakht");


export default class FaceToFaceCourseController extends FrontendController
{
    #url =  getEnv('FRONTEND_URL');

    constructor()
    {
        super();
        this.model = new FaceToFaceCourseModel();
        this.orderModel = new OrderModel();
        this.userModel = new UserModel();
        

        

    }
    
    async getIndex(req,res){
        try{

           log('course-details');
           const userInfo = await this.userModel.getRow(req?.session?.user_id);
            const slug = this.safeString(req.params.slug);
            const course = await this.model.getCourse(slug);
            const getallCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
            const getSettings = await this.globalModel.getSettings();
            const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
            const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
            const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
            if(!course)
            {
                return res.redirect(this.#url);
            }
            // const category = await this.model.getCategoryByID(course.category_id._id);
            const data = {
                "title" : course.title_seo,
                "seo" : course.title_seo,
                "userInfo":userInfo,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                "allCategoryFaceToFaceCourse" : getallCategoryFaceToFaceCourse,
                "setting":getSettings,
                // "category" : category,
                "description_seo" : course.description_seo,
                "course" : course,
            };  
            return res.render(this.templatePath + 'faceTofaceCourses/course.html',data);           
        }
        catch(e){
            return super.toError(e,req,res);
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
            const resultVeryfyPay = await aqayepardakht.Verify({ amount: course.price,transid: req.body.transid});
            log(resultVeryfyPay);
            if(resultVeryfyPay.data.code == '1')
            {
                const type='3';
                const result= await this.orderModel.create(req?.session?.user_id,course._id,req.body.transid,course.price,type,course.title);
                if(result._id)
                {
                    return res.redirect(`${this.#url}face-to-face-course-details/${course.slug}?msg=pyment-success`);
                }
                else{
                return res.redirect(`${this.#url}face-to-face-course-details/${course.slug}?msg=pyment-isdup`);
                }
                //add order to mongodb
            }
            else
            {
                return res.redirect(`${this.#url}face-to-face-course-details/${course.slug}?msg=pyment-not-success`);
            }
        }
        catch(e){
            return res.redirect(`${this.#url}face-to-face-course-details/${course.slug}?msg=pyment-error`);
        }
    }


}
