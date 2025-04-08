import FrontendController from "../../core/FrontendController.js";
import translate from "../../core/translate.js";
import {log, getEnv} from '../../core/utils.js';
import BlogModel from '../../models/frontend/blogList.js';
import  UserModel from '../../models/frontend/user.js';

export default class BlogController extends FrontendController
{
    #url =  getEnv('FRONTEND_URL');

    constructor()
    {
        super();
        this.model = new BlogModel();
        this.userModel = new UserModel();
        
    }
    
    async getIndex(req,res){
        try{

            const userInfo = await this.userModel.getRow(req?.session?.user_id);
            const slug = this.safeString(req.params.slug);
            const blog = await this.model.getBlog(slug);
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
            const getSettings = await this.globalModel.getSettings();
            const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
            const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
            const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
            if(!blog)
            {
                return res.redirect(this.#url);
            }
            const category = await this.model.getCategoryByID(blog.category_id._id);
            const data = {
                "title" : blog.title_seo,
                "userInfo":userInfo,
                "allCategoryBlog" : getAllCategoryBlog,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                "setting":getSettings,
                "category" : category,
                "description_seo" : blog.description_seo,
                "blog" : blog,
            };  
            return res.render(this.templatePath + 'blogs/blog.html',data);           
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
