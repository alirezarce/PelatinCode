import { Router } from "express";
import {log} from '../../core/utils.js';
import smsController from "../../controllers/backend/smsController.js";
import AuthMiddleware from '../../middlewares/backend/auth.js';
const controller = new smsController();
const route = Router();
try{
    route.get('/send_userGroup',new AuthMiddleware().needAuth,controller.snedUserGroup);
    route.post('/send_userGroup',new AuthMiddleware().needAuth,controller.PostSnedUserGroup);
    route.get('/send_user',new AuthMiddleware().needAuth,controller.snedUser);
    route.post('/send_user',new AuthMiddleware().needAuth,controller.PostSendUser);
    route.get('/usersName',new AuthMiddleware().needAuth,controller.getAllUserByFn);
    route.get('/usersMobile',new AuthMiddleware().needAuth,controller.getAllUserByMobile);
    route.get('/usersGroup',new AuthMiddleware().needAuth,controller.getAllUserGroup);
    route.get('/log',new AuthMiddleware().needAuth,controller.indexLog);
    route.get('/log_otp',new AuthMiddleware().needAuth,controller.indexLogOtp);
    route.get('/log_birthday',new AuthMiddleware().needAuth,controller.indexLogBirthdy);
    route.get('/log_users',new AuthMiddleware().needAuth,controller.indexLogUsers);
    route.get('/log_group',new AuthMiddleware().needAuth,controller.indexLogGroup);

}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

