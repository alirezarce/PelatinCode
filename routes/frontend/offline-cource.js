import { Router } from "express";
import {log} from '../../core/utils.js';
import OfflineCourseController from "../../controllers/frontend/OfflineCourseController.js";
const controller = new OfflineCourseController();
const route = Router();
try{
    route.get('/:slug',controller.getIndex);
    route.post('/:slug',controller.postIndex);

}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

