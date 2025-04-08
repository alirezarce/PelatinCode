import { t } from "i18next";
import FrontendController from "../../core/FrontendController.js";
import translate from "../../core/translate.js";
import {log, getEnv} from '../../core/utils.js';
import FaceToFaceCourseListModel from '../../models/frontend/faceTofaceCourseList.js';
import FaceToFaceCourseModel from '../../models/frontend/faceTofaceCourseList.js';
import  UserModel from '../../models/frontend/user.js';

export default class FaceToFaceCourseController extends FrontendController
{
    #url =  getEnv('FRONTEND_URL');

    constructor()
    {
        super();
        this.model = new FaceToFaceCourseListModel();
        this.FaceToFaceCourseModel =new FaceToFaceCourseModel();
        this.userModel = new UserModel();
        

    }
    
    async getIndex(req,res){
        try{
            log('course-list')
            const userInfo = await this.userModel.getRow(req?.session?.user_id);
            const page = this.getPage(req);
            const params = {
            };
            const paramsQuery = this.toQuery(params);
            const slug = this.safeString(req.params.slug);
            const category = await this.model.getCategory(slug);
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
            let url = 'face-to-face-course-list/' + slug + '/?' + paramsQuery;
            const resultPagination = await this.model.pagination(category._id,null,page);
                const getSettings = await this.globalModel.getSettings();
                const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
                const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
                const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
                const getLastFaceToFaceCourse = await this.FaceToFaceCourseModel.getLastFaceToFaceCourse();

                const data = {
                    "url" : url,
                    "title" : " دوره های حضوری " + category.title_seo,
                    "userInfo":userInfo,
                    "allCategoryBlog" : getAllCategoryBlog,
                    "category" : category,
                    "description_seo" : category.description_seo,
                    "resultPagination" : resultPagination,
                    "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                    "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                    "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                    "lastFceToFaceCourse" : getLastFaceToFaceCourse,
                    "setting":getSettings,
                };  

                return res.render(this.templatePath + 'faceTofaceCourses/index.html',data);    
            
      
        }
        catch(e){
            return super.toError(e,req,res);
           
        }
    }

    async getIndexAll(req,res){
        try{
            log('course-listAll')
            const userInfo = await this.userModel.getRow(req?.session?.user_id);
            const page = this.getPage(req);
            const params = {
            };
            const paramsQuery = this.toQuery(params);
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
            const resultPagination = await this.model.paginationAll(page);
                const getSettings = await this.globalModel.getSettings();
                const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
                const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
                const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
                const getLastFaceToFaceCourse = await this.FaceToFaceCourseModel.getLastFaceToFaceCourse();

                const data = {
                    "title" : " دوره های حضوری " ,
                    "userInfo":userInfo,
                    "allCategoryBlog" : getAllCategoryBlog,
                    "resultPagination" : resultPagination,
                    "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                    "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                    "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                    "lastFceToFaceCourse" : getLastFaceToFaceCourse,
                    "setting":getSettings,
                };  

                return res.render(this.templatePath + 'faceTofaceCourses/index.html',data);    
            
      
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
