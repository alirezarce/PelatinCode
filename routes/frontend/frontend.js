import { Router } from "express";
import {log} from '../../core/utils.js';
import homeRoute from './home.js';
//import challengeRoute from './challenge.js';
import userRoute from './user.js';
import pageRoute from './page.js';
import searchRoute from './search.js';
import hallFameRoute from './hall-of-fame.js';
import blogListRoute from './blog-list.js';
import blogRoute from './blog.js';
import coachRoute from './coach.js';
import coachListRoute from './coach-list.js';
import FaceToFaceCourseListRoute from './face-to-face-cource-list.js';
import FaceToFaceCourseRoute from './face-to-face-cource.js';
import OnlineCourseListRoute from './online-cource-list.js';
import OnlineCourseRoute from './online-cource.js';
import OfflineCourseListRoute from './offline-cource-list.js';
import OfflineCourseRoute from './offline-cource.js';
import OrderRoute from './order.js';


const route = Router();
route.use('/',homeRoute);
route.use('/user/',userRoute);
route.use('/page/',pageRoute);
route.use('/search/',searchRoute);
route.use('/blogs/',blogListRoute);
route.use('/blog/',blogRoute);
route.use('/coach/',coachRoute);
route.use('/coach-list/',coachListRoute);
route.use('/face-to-face-course-list/',FaceToFaceCourseListRoute);
route.use('/face-to-face-course-details/',FaceToFaceCourseRoute);
route.use('/online-course-list/',OnlineCourseListRoute);
route.use('/online-course-details/',OnlineCourseRoute);
route.use('/offline-course-list/',OfflineCourseListRoute);
route.use('/offline-course-details/',OfflineCourseRoute);
route.use('/order/',OrderRoute);



export default route;    
