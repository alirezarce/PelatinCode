import { Router } from "express";
import {log} from '../../core/utils.js';
import CoachController from "../../controllers/backend/CoachController.js";
import AuthMiddleware from '../../middlewares/backend/auth.js';
const controller = new CoachController();
const route = Router();
try{
    route.get('/add',new AuthMiddleware().needAuth,controller.add);
    route.post('/add',new AuthMiddleware().needAuth,controller.postAdd);
    route.get('/',new AuthMiddleware().needAuth,controller.index);
    route.get('/edit/:edit_id',new AuthMiddleware().needAuth,controller.edit);
    route.post('/edit/:edit_id',new AuthMiddleware().needAuth,controller.postEdit);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

