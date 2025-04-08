import { Router } from "express";
import {log} from '../../core/utils.js';
import BlogController from "../../controllers/frontend/BlogController.js";
const controller = new BlogController();
const route = Router();
try{
    route.get('/:slug',controller.getIndex);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

