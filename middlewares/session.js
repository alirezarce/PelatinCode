
import BaseMiddleware from '../core/BaseMiddleware.js';
import {log,getEnv} from '../core/utils.js';
import expressSession from 'express-session';
import connectRedis from 'connect-redis';
import {Redis} from '../global.js';
const RedisStore = connectRedis(expressSession);
export default class SessionMiddleware extends BaseMiddleware
{
    constructor(){
        super();
    }

    async handle(req,res,next){
        try{
            expressSession({
                store: new RedisStore({ client: Redis.redis }),             
                secret: getEnv('SESSION_SECRET'),
                name : getEnv('SESSION_NAME'),
                resave: false,
                saveUninitialized: true,
                cookie: { 
                    httpOnly:true,
                    secure:getEnv('SESSION_SECURE','bool'),
                    maxAge : 1000 * 60 * getEnv('SESSION_EXPIRE','number'),
                    sameSite:getEnv('SESSION_SAMESITE')
                }
            })(req, res, next);
        }
        catch(e){
		log(e)
            return super.toError(e,req,res);
        }
    }

}
