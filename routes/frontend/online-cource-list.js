import { Router } from "express";
import OnlineCourseListController from "../../controllers/frontend/OnlineCourseListController.js";
const controller = new OnlineCourseListController();
const route = Router();
try{
    route.get('/:slug',controller.getIndex);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

