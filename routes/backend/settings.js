import { Router } from "express";
import {log} from '../../core/utils.js';
import SettingsController from "../../controllers/backend/SettingsController.js";
import AuthMiddleware from '../../middlewares/backend/auth.js';
const controller = new SettingsController();
const route = Router();
try{
    route.get('/',new AuthMiddleware().needAuth,controller.edit);
    route.get('/edit/:edit_id',new AuthMiddleware().needAuth,controller.edit);
    route.post('/edit/:edit_id',new AuthMiddleware().needAuth,controller.postEdit);   
    route.get('/sliders',new AuthMiddleware().needAuth,controller.slider);
    route.get('/edit_slider/:edit_id',new AuthMiddleware().needAuth,controller.editSlider);
    route.post('/edit_slider/:edit_id',new AuthMiddleware().needAuth,controller.postEditSlider);


}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

