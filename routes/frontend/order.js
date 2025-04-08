import { Router } from "express";
import {log} from '../../core/utils.js';
import OrderController from "../../controllers/frontend/OrderController.js";
import AuthUserMiddleware from '../../middlewares/frontend/auth.js';
const controller = new OrderController();
const route = Router();
try{
    route.post('/creat/:slug',new AuthUserMiddleware().needAuth,controller.creat);

}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

