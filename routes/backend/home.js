import { Router } from "express";
import {log} from '../../core/utils.js';
import HomeController from "../../controllers/backend/HomeController.js";
import AuthMiddleware from '../../middlewares/backend/auth.js';
const controller = new HomeController();
const route = Router();
try{
    route.get('/',new AuthMiddleware().needAuth,controller.getIndex);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

