import FrontendController from "../../core/FrontendController.js";
import translate from "../../core/translate.js";
import {log, getEnv} from '../../core/utils.js';

export default class HallFameController extends FrontendController
{
    #url =  getEnv('FRONTEND_URL');

    constructor()
    {
        super();
    }
    
    async getIndex(req,res){
        try{
            const hallOfFame = await this.globalModel.getHallOfFame();
            const data = {
                "title" : "برترین ها",
                "mainCategory" : await this.getMainCategoryList(),
                "getUserBadge" : this.getUserBadge,
                "hallOfFame" : hallOfFame,
            };  
            return res.render(this.templatePath + 'hall-of-fame/index.html',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async getUserBadge(score){
        try{
            const row = await this.globalModel.getBadge(score);
            if(row.length == 1)
            {
                const url = getEnv('FRONTEND_URL') + row[0].icon;
                const title = row[0].title;
                return {url,title};
            }
            else
                return '';
        }
        catch(e){
            return e.toString();
        }
    }







}
