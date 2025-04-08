import { Router } from "express";
import {log} from '../../core/utils.js';
import OnlineCourseController from "../../controllers/frontend/OnlineCourseController.js";
const controller = new OnlineCourseController();
const route = Router();
try{
    route.get('/:slug',controller.getIndex);
    route.post('/:slug',controller.postIndex);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

