import { Router } from "express";
import {log} from '../../core/utils.js';
import CoachController from "../../controllers/frontend/CoachController.js";
const controller = new CoachController();
const route = Router();
try{
    route.get('/:slug',controller.getIndex);

}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

