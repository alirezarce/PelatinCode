import BaseController from "../core/BaseController.js";
import {log,getEnv} from '../core/utils.js';

export default class Error500Controller extends BaseController
{
    constructor()
    {
        super();
    }

    async handle(error,req,res,next)
    {
        try{
             //res.send.json('500',{"error":error});
             return  res.json({ "error":error});

        }
        catch(e){
            return super.toError(e,req,res);
        }
    }
}
