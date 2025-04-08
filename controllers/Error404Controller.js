import BaseController from "../core/BaseController.js";
import {log,getEnv} from "../core/utils.js";

export default class Error404Controller extends BaseController
{
    constructor()
    {
        super();
    }

    async handle(req,res)
    {
        try{
            return res.status(404).render('404.html');
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }
}
