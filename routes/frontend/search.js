import { Router } from "express";
import {log} from '../../core/utils.js';
import SearchController from "../../controllers/frontend/SearchController.js";
const controller = new SearchController();
const route = Router();
try{
    route.get('/',controller.getIndex);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

