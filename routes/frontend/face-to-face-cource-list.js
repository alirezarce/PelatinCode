import { Router } from "express";
import {log} from '../../core/utils.js';
import FaceToFaceCourseListController from "../../controllers/frontend/FaceToFaceCourseListController.js";
const controller = new FaceToFaceCourseListController();
const route = Router();
try{
    route.get('/:slug',controller.getIndex);
    route.get('/',controller.getIndexAll);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

