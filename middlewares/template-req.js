
import BaseMiddleware from '../core/BaseMiddleware.js';
import {log} from '../core/utils.js';

export default class TemplateReqMiddleware extends BaseMiddleware
{
    constructor(){
        super();
    }

    async handle(req,res,next){
        try{
            if(req?.session?.user_id)
            {
                req.app.locals.user_info = req.session.user_info;
            }
            else
            {
                req.app.locals.user_info = {};
            }
            req.app.set('req',req);
            next();    
        }
        catch(e){
            next();
        }
    }

}
