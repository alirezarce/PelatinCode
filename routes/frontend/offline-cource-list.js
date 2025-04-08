import { Router } from "express";
import OfflineCourseListController from "../../controllers/frontend/OfflineCourseListController.js";
const controller = new OfflineCourseListController();
const route = Router();
try{
    route.get('/:slug',controller.getIndex);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

