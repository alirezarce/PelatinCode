import { Router } from "express";
import {log} from '../../core/utils.js';
import UserController from "../../controllers/frontend/UserController.js";
import AuthUserMiddleware from '../../middlewares/frontend/auth.js';
import RateLimitMiddleware from '../../middlewares/ratelimit.js';

const controller = new UserController();
const route = Router();
try{
    route.get('/login',new AuthUserMiddleware().isAuth,controller.getLogin);
    route.post('/login',new AuthUserMiddleware().isAuth,controller.postLogin);
    route.get('/register',new AuthUserMiddleware().isAuth,controller.getRegister);
    route.post('/register',new AuthUserMiddleware().isAuth,controller.postRegister);
    route.get('/reset-password',new AuthUserMiddleware().isAuth,controller.getResetPassword);
    route.post('/reset-password',new AuthUserMiddleware().isAuth,new RateLimitMiddleware().handle,controller.postResetPassword);
    route.get('/logout',new AuthUserMiddleware().needAuth,controller.getLogout);
    route.get('/dashboard',new AuthUserMiddleware().needAuth,controller.getDashboard);
    route.get('/profile',new AuthUserMiddleware().needAuth,controller.getProfile);
    route.post('/profile',new AuthUserMiddleware().needAuth,controller.postProfile);
    route.post('/verify-otp',new AuthUserMiddleware().isAuth,controller.verifyOtp);
    route.post('/verify-otp-recovery',new AuthUserMiddleware().isAuth,controller.verifyOtpRecovery);
    route.get('/my-video/:type/:slug',new AuthUserMiddleware().needAuth,controller.getVideo);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

