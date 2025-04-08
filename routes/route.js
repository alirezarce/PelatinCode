import { Router } from "express";
import {log,getEnv} from '../core/utils.js';
import backendRoute from './backend/backend.js';
import frontendRoute from './frontend/frontend.js';

const route = Router();
route.use('/',frontendRoute);
route.use(`/${getEnv('BACKEND_ROUTE')}/`,backendRoute);



export default route;    
