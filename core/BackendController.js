import autoBind from 'auto-bind';
import BaseController from "./BaseController.js";
import { getEnv,log,toNumber,toObjectId } from './utils.js';
import {encode} from 'html-entities';
import {URLSearchParams} from 'node:url';


export default class BackendController extends BaseController
{
    constructor()
    {
        super();
        if(this.constructor === BackendController)
        {
            throw new Error(`BackendController is abstract class!`);
        }
        this.templatePath = 'backend/'+getEnv('BACKEND_TEMPLATE')+'/';
    }


}