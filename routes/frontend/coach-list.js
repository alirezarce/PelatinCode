import { Router } from "express";
import {log} from '../../core/utils.js';
import CoachListController from "../../controllers/frontend/CoachListController.js";
const controller = new CoachListController();
const route = Router();
try{
    route.get('/',controller.getIndex);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

