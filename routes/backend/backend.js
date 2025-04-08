import { Router } from "express";
import {log} from '../../core/utils.js';
import userRoute from './user.js';
import homeRoute from './home.js';
import userGroupRoute from './userGroup.js';
import pageRoute from './page.js';
import usersRoute from './users.js';
import blogRote from './blog.js';
import coachRote from './coach.js';
import skyRoomRoute from './skyRoom.js';
import categoryBlogRoute from './categoryBlog.js';
import categoryFaceToFaceCourseRoute from './categoryFaceToFaceCourse.js';
import onlineCourseRoute from './onlineCourse.js';
import categoryOfflineCourseRoute from './categoryOfflineCourse.js';
import categoryOnlineCourseRoute from './categoryOnlineCourse.js';
import offlineCourseRoute from './offlineCourse.js';
import smsRoute from './sms.js';
import orderRoute from './order.js';
import settingsRoute from './settings.js';
import faceTofaceCourseRoute from "./faceTofaceCourse.js";
const route = Router();
route.use('/',homeRoute);
route.use('/user/',userRoute);
route.use('/userGroup/',userGroupRoute);
route.use('/page/',pageRoute);
route.use('/users/',usersRoute);
route.use('/blog/',blogRote);
route.use('/coach/',coachRote);
route.use('/skyRoom/',skyRoomRoute);
route.use('/categoryBlog/',categoryBlogRoute);
route.use('/onlineCourse/',onlineCourseRoute);
route.use('/categoryOfflineCourse/',categoryOfflineCourseRoute);
route.use('/categoryOnlineCourse/',categoryOnlineCourseRoute);
route.use('/offlineCourse/',offlineCourseRoute);
route.use('/categoryFaceToFaceCourse/',categoryFaceToFaceCourseRoute);
route.use('/FaceToFaceCourse/',faceTofaceCourseRoute);
route.use('/sms/',smsRoute);
route.use('/settings/',settingsRoute);
route.use('/order/',orderRoute);






export default route;    
