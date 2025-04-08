import FrontendController from "../../core/FrontendController.js";
import translate from "../../core/translate.js";
import {log, getEnv} from '../../core/utils.js';
import CoachModel from '../../models/frontend/coachList.js';
import  UserModel from '../../models/frontend/user.js';



export default class CoachController extends FrontendController
{
    #url =  getEnv('FRONTEND_URL');

    constructor()
    {
        super();
        this.model = new CoachModel();
        this.userModel = new UserModel();
        
    }
    
    async getIndex(req,res){
        try{
            log('Coach')
            const slug = this.safeString(req.params.slug);
            const coach = await this.model.getCoach(slug);
            if(!coach)
            {
                return res.redirect(this.#url);
            }
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
            const getSettings = await this.globalModel.getSettings();
            const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
            const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
            const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
            const userInfo = await this.userModel.getRow(req?.session?.user_id);

            const data = {
                "allCategoryBlog" : getAllCategoryBlog,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                 "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                "setting":getSettings,
                "title" : coach.title_seo,   
                "seo" : coach.title_seo,   
                "description_seo" : coach.description_seo,
                "coach" : coach,
                "userInfo":userInfo,
            };  
            return res.render(this.templatePath + 'coaches/coach.html',data);           
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }




}
