import { Router } from "express";
import {log} from '../../core/utils.js';
import HallFameController from "../../controllers/frontend/HallFameController.js";
const controller = new HallFameController();
const route = Router();
try{
    route.get('/',controller.getIndex);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

