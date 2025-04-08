import FrontendController from "../../core/FrontendController.js";
import translate from "../../core/translate.js";
import {log, getEnv} from '../../core/utils.js';
import SliderModel from '../../models/frontend/settings.js';
import BlogModel from '../../models/frontend/blogList.js';
import FaceToFaceCourseModel from '../../models/frontend/faceTofaceCourseList.js';
import OnlineCourseModel from '../../models/frontend/onlineCourseList.js';
import OfflineCourseModel from '../../models/frontend/offlineCourseList.js';

import  UserModel from '../../models/frontend/user.js';





export default class HomeController extends FrontendController
{
    #url =  getEnv('FRONTEND_URL');

    constructor()
    {
        super();
        this.SliderModel = new SliderModel();
        this.BlogModel = new BlogModel();
        this.FaceToFaceCourseModel =new FaceToFaceCourseModel();
        this.OnlineCourseModel =new OnlineCourseModel();
        this.OfflineCourseModel =new OfflineCourseModel();
        this.userModel = new UserModel();
        
        

    }
    
    async getIndex(req,res){
        try{
            const userInfo = await this.userModel.getRow(req?.session?.user_id);
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
            const getSettings = await this.globalModel.getSettings();
            const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
            const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
            const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
            const getAllManCoach = await this.globalModel.getManCoachListAll();
            const getAllWomanCoach = await this.globalModel.getWomanCoachListAll();
            const getSlider = await this.SliderModel.getSliders();
            const getLastBlog = await this.BlogModel.getLastBlog();
            const getLastFaceToFaceCourse = await this.FaceToFaceCourseModel.getLastFaceToFaceCourse();
            const getLastOnlienCourse = await this.OnlineCourseModel.getLastOnlineCourse();
            const getLastOfflineCourse = await this.OfflineCourseModel.getLastOfflineCourse();
            const data = {
                "title" : "سایت ورزشی سالک | باشگاه ورزشی حضوری و آنلاین",
                "seo":"alirezarce",
                "userInfo":userInfo,
                "allCategoryBlog" : getAllCategoryBlog,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                "allManCoach" : getAllManCoach,
                "allWomanCoach" : getAllWomanCoach,
                "sliders":getSlider,
                "lastBlog":getLastBlog,
                "lastFceToFaceCourse" : getLastFaceToFaceCourse,
                "lastOnlineCourse" : getLastOnlienCourse,
                "lastOfflineCourse":getLastOfflineCourse,
                "setting":getSettings
            };  
            return res.render(this.templatePath + 'home/index.html',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }






}
