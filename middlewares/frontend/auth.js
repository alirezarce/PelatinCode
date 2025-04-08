
import BaseMiddleware from '../../core/BaseMiddleware.js';
import {log,getEnv} from '../../core/utils.js';

export default class AuthUserMiddleware extends BaseMiddleware
{
    constructor(){
        super();
    }

    async needAuth(req,res,next){
        try{
            if(req?.session?.user_id)
            {
                req.app.locals.user_info = req.session.user_info;
                return next();
            }
            else
            {
                return res.redirect(`${getEnv('FRONTEND_URL')}user/login/?msg=no-access`);
            }
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async isAuth(req,res,next){
        try{
            if(req?.session?.user_id)
            {
                return res.redirect(`${getEnv('FRONTEND_URL')}`);
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

