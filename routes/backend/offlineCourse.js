import { Router } from "express";
import {log} from '../../core/utils.js';
import OfflineCourseController from "../../controllers/backend/OfflineCourseController.js";
import AuthMiddleware from '../../middlewares/backend/auth.js';
const controller = new OfflineCourseController();
const route = Router();
try{
    route.get('/add',new AuthMiddleware().needAuth,controller.add);
    route.post('/add',new AuthMiddleware().needAuth,controller.postAdd);
    route.get('/',new AuthMiddleware().needAuth,controller.index);
    route.get('/edit/:edit_id',new AuthMiddleware().needAuth,controller.edit);
    route.post('/edit/:edit_id',new AuthMiddleware().needAuth,controller.postEdit);
    route.get('/add_video/:course_id',new AuthMiddleware().needAuth,controller.addVideo);
    route.post('/add_video/:course_id',new AuthMiddleware().needAuth,controller.postVideo);
    route.get('/list_videos/:course_id',new AuthMiddleware().needAuth,controller.listVideos);
    route.get('/edit_video/:course_id/:edit_id',new AuthMiddleware().needAuth,controller.editVideo);
    route.post('/edit_video/:course_id/:edit_id',new AuthMiddleware().needAuth,controller.postEditVideo);
}
catch(e){
    route.use(controller.errorHandling(e.toString()));
}

export default route;

