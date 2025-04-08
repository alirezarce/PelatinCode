import { t } from "i18next";
import FrontendController from "../../core/FrontendController.js";
import translate from "../../core/translate.js";
import {log, getEnv} from '../../core/utils.js';
import OfflineCourseListModel from '../../models/frontend/offlineCourseList.js';
import OfflineCourseModel from '../../models/frontend/offlineCourseList.js';

import  UserModel from '../../models/frontend/user.js';



export default class OfflineCourseListController extends FrontendController
{
    #url =  getEnv('FRONTEND_URL');

    constructor()
    {
        
        super();
        this.model = new OfflineCourseListModel();
        this.OfflineCourseModel =new OfflineCourseModel();
        this.userModel = new UserModel();
        

    }
    
    async getIndex(req,res){
        try{
            log('offlinecourse-list')
            const userInfo = await this.userModel.getRow(req?.session?.user_id);
            const page = this.getPage(req);
            const params = {
            };
            const paramsQuery = this.toQuery(params);
            const slug = this.safeString(req.params.slug);
            const category = await this.model.getCategory(slug);
            log(category._id)
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
                let url = 'online-course-list/' + slug + '/?' + paramsQuery;
                const resultPagination = await this.model.pagination(category._id,null,page);
                const getSettings = await this.globalModel.getSettings();
                const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
                const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
                const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
                
                

                const data = {
                    "url" : url,
                    "title" : " دوره های آفلاین " + category.title_seo,
                    "userInfo":userInfo,
                    "allCategoryBlog" : getAllCategoryBlog,
                    "category" : category,
                    "description_seo" : category.description_seo,
                    "resultPagination" : resultPagination,
                    "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                    "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                    "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                    "setting":getSettings,
                };  
                return res.render(this.templatePath + 'offlineCourses/index.html',data);    
            
       
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






}
