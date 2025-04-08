import FrontendController from "../../core/FrontendController.js";
import translate from "../../core/translate.js";
import {log, getEnv} from '../../core/utils.js';
import PageModel from '../../models/frontend/page.js';
import  UserModel from '../../models/frontend/user.js';


export default class PageController extends FrontendController
{
    constructor()
    {
        super();
        this.model = new PageModel();
        this.userModel = new UserModel();
        
    }
    
    async getPage(req,res){
        try{
            const page = await this.model.getPage(req.params.slug);
            const userInfo = await this.userModel.getRow(req?.session?.user_id);
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
            const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
            const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
            const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
            const getSettings = await this.globalModel.getSettings();
            console.log('setting');
            console.log(getSettings);
            if(!page)
            {
                return res.redirect(getEnv('FRONTEND_URL'));
            }
            const data = {
                "title" : page.title_seo,
                "allCategoryBlog" : getAllCategoryBlog,
                "userInfo":userInfo,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "page" : page,
                "description_seo" : page.description_seo,
                "setting":getSettings,
                "allCategoryBlog" : getAllCategoryBlog,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
            };  
            return res.render(this.templatePath + 'page/index.html',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }






}
