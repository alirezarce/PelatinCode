import FrontendController from "../../core/FrontendController.js";
import translate from "../../core/translate.js";
import {log, getEnv} from '../../core/utils.js';
import CoachListModel from '../../models/frontend/coachList.js';
import CoachModel from '../../models/frontend/coachList.js';
import  UserModel from '../../models/frontend/user.js';


export default class CoachController extends FrontendController
{
    #url =  getEnv('FRONTEND_URL');

    constructor()
    {
        super();
        this.model = new CoachListModel();
        this.userModel = new UserModel();
        
    }
    
    async getIndex(req,res){
        try{
           
            const page = this.getPage(req);
            
            const params = {
                
            };
            const paramsQuery = this.toQuery(params);
            const getAllCoach = await this.model.getAllCoach();

            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
                const getSettings = await this.globalModel.getSettings();
                const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
                const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
                const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
                const userInfo = await this.userModel.getRow(req?.session?.user_id);
                
                const data = {
                    "title" : " اساتید " ,
                    "userInfo":userInfo,
                    "getAllCoach":getAllCoach,
                    "allCategoryBlog" : getAllCategoryBlog,
                    "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                    "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                    "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                    "setting":getSettings,
                    
                };  
                return res.render(this.templatePath + 'coaches/index.html',data);    
            
       
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }



}
