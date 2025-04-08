import { Router } from "express";
import {log} from '../../core/utils.js';
import BlogListController from "../../controllers/frontend/BlogListController.js";
const controller = new BlogListController();
const route = Router();
try{
    route.get('/:slug',controller.getIndex);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

