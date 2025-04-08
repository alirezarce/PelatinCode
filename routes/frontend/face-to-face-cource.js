import { Router } from "express";
import {log} from '../../core/utils.js';
import FaceToFaceCourseController from "../../controllers/frontend/FaceToFaceCourseController.js";
const controller = new FaceToFaceCourseController();
const route = Router();
try{
    route.get('/:slug',controller.getIndex);
    route.post('/:slug',controller.postIndex);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

