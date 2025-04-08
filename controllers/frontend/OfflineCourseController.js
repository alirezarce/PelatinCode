import FrontendController from "../../core/FrontendController.js";
import translate from "../../core/translate.js";
import {log, getEnv} from '../../core/utils.js';
import  UserModel from '../../models/frontend/user.js';
import  OrderModel from '../../models/frontend/order.js';
import  OfflineCourseModel from '../../models/frontend/offlineCourse.js';
import AqayePardakht from "../../core/aqayepardakht.js";
import axios from "axios";
const aqayepardakht =  new AqayePardakht("aqayepardakht");


export default class OfflineCourseController extends FrontendController
{
    #url =  getEnv('FRONTEND_URL');

    constructor()
    {
        super();
        this.model = new OfflineCourseModel();
        this.orderModel = new OrderModel();
        this.userModel = new UserModel();
        
        
      

        
    }
    
    async getIndex(req,res){
        try{

           log('OfflineCourse-details');
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
            // const category = await this.model.getCategoryByID(course.category_id._id);
            const data = {
                "title" : course.title_seo,
                "seo" : course.title_seo,
                "allCategoryBlog" : getAllCategoryBlog,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                "setting":getSettings,
                // "category" : category,
                "description_seo" : course.description_seo,
                "course" : course,
            };  
            return res.render(this.templatePath + 'offlineCourses/course.html',data);           
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
        console.log('course');
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
            // console.log('course');
            // console.log(course);
            // console.log('resultVeryfyPay');
            // console.log(resultVeryfyPay);
            if(resultVeryfyPay.data.code == '1')
            {
                 //add order to mongodb
                const type='2';
                const result= await this.orderModel.create(req?.session?.user_id,course._id,req.body.transid,course.price,type,course.title,course.slug);
                if(result._id)
                { 
                    return res.redirect(`${this.#url}offline-course-details/${course.slug}?msg=pyment-success`);
                }
                else{
                return res.redirect(`${this.#url}offline-course-details/${course.slug}?msg=pyment-isdup`);
                }
               
            }
            else
            {
                return res.redirect(`${this.#url}offline-course-details/${course.slug}?msg=pyment-not-success`);
            }
        }
        catch(e){
            return res.redirect(`${this.#url}offline-course-details/${course.slug}?msg=pyment-error`);
        }
    }
    

}
