import { Router } from "express";
import {log} from '../../core/utils.js';
import UserController from "../../controllers/backend/UserController.js";
import AuthMiddleware from '../../middlewares/backend/auth.js';
const controller = new UserController();
const route = Router();
try{
    route.get('/login',new AuthMiddleware().isAuth,controller.getLogin);
    route.post('/login',new AuthMiddleware().isAuth,controller.postLogin);
    route.get('/logout',new AuthMiddleware().needAuth,controller.getLogout);
    route.get('/profile',new AuthMiddleware().needAuth,controller.getProfile);
    route.post('/profile',new AuthMiddleware().needAuth,controller.saveProfile);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

