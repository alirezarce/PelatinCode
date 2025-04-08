import { Router } from "express";
import {log} from '../../core/utils.js';
import PageController from "../../controllers/frontend/PageController.js";
const controller = new PageController();
const route = Router();
try{
    route.get('/:slug/',controller.getPage);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

