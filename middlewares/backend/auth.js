
import BaseMiddleware from '../../core/BaseMiddleware.js';
import {log,getEnv} from '../../core/utils.js';

export default class AuthMiddleware extends BaseMiddleware
{
    constructor(){
        super();
    }

    async needAuth(req,res,next){
        try{
            if(req?.session?.admin_id)
            {
                req.app.locals.admin_info = req.session.admin_info;
                return next();
            }
            else
            {
                return res.redirect(`${getEnv('BACKEND_URL')}user/login/?msg=no-access`);
            }
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async isAuth(req,res,next){
        try{
            if(req?.session?.admin_id)
            {
                return res.redirect(`${getEnv('BACKEND_URL')}`);
            }
            else
            {
                return next();
            }
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


}

