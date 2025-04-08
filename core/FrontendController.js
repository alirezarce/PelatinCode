import autoBind from 'auto-bind';
import BaseController from "./BaseController.js";
import { getEnv,log,toNumber,toObjectId } from './utils.js';
import {encode} from 'html-entities';
import {URLSearchParams} from 'node:url';
import GlobalModel from '../models/frontend/global.js';


export default class FrontendController extends BaseController
{
    constructor()
    {
        super();
        if(this.constructor === FrontendController)
        {
            throw new Error(`FrontendController is abstract class!`);
        }
        this.templatePath = 'frontend/'+getEnv('FRONTEND_TEMPLATE')+'/';
        this.globalModel = new GlobalModel();

    }

    async getCategoryList(){
        const all =  await this.globalModel.getCategoryBlogListAll();
        
        return {
            all
        };
    }

    async getCategoryOfflineCourseList(){
        const all =  await this.globalModel.getCategoryOffileCoursListAll();
        return {
            all
        };
    }

    async getCategoryOnlineCourseList(){
        const all =  await this.globalModel.getCategoryOnlineCoursListAll();
        return {
            all
        };
    }

    async getCategoryFaceToFaceCourseList(){
        const all =  await this.globalModel.getCategoryFaceToFaceCourseListAll();
        return {
            all
        };
    }
    async getManCoachList(){
        const all =  await this.globalModel.getManCoachListAll();
        return {
            all
        };
    }
    async getWomanCoachList(){
        const all =  await this.globalModel.getWomanCoachListAll();
        return {
            all
        };
    }



    async getSettings(){
        const all =  await this.globalModel.getSettings();
        return {
            all
        };
    }




}