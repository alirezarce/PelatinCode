import FrontendController from "../../core/FrontendController.js";
import translate from "../../core/translate.js";
import {log, getEnv} from '../../core/utils.js';
import SearchModel from '../../models/frontend/search.js';

export default class SearchController extends FrontendController
{
    constructor()
    {
        super();
        this.model = new SearchModel();
    }
 

    async getIndex(req,res){
        try{
            const page = this.getPage(req);
            const tag = this.safeString(this.input(req.query.tag));
            const name = this.safeString(this.input(req.query.name));
            const params = {
                tag,name
            };
            const paramsQuery = this.toQuery(params);
            const url = getEnv('FRONTEND_URL') + 'search/?' +  paramsQuery;
            const resultPagination = await this.model.pagination(name.toLowerCase(),tag.toLowerCase(),page);
            const data = {
                "title" : "جستجو",
                "url" :url,
                "params" : params,
                "resultPagination" : resultPagination,
                "mainCategory" : await this.getMainCategoryList(),
            };  
            return res.render(this.templatePath + 'search/index.html',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }






}
