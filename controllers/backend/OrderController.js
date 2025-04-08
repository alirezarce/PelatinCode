import BackendController from "../../core/BackendController.js";
import translate from "../../core/translate.js";
import {log, getEnv,getPath} from '../../core/utils.js';
import OrderModel from '../../models/backend/order.js';
import {isFile,unlink,fileExists} from '../../core/fs.js';
import {allowImageFileUpload,fileNameGenerator,toByte} from '../../core/uploader.js';



export default class OrderController extends BackendController
{
    #url =  getEnv('BACKEND_URL') + 'order/';

    constructor()
    {
        super();
        this.model = new OrderModel();

    }
    #getParams(req){
        try{
            const title = this.safeString(this.input(req.query.title));
            const params = {
                title
            };
            const paramsQuery = this.toQuery(params);
            return {
                "params" : params,
                "params_query" : paramsQuery,
            }    
        }
        catch(e){
            return {
                "params" : {},
                "params_query" : '',
            }    
        }
    }
    
    async index(req,res){
        try{
            const sortFields = ['_id','name','last_edit_date_time','status'];
            const {page,sort_field,sort_type} = this.handlePagination(req,sortFields);      
            const {params,params_query} = this.#getParams(req);
            const url = this.#url + '?' + params_query;
            const route_url = this.#url;     
            const pagination = await this.model.pagination(page,sort_field,sort_type,params?.title);
            const data = {
                "title" : ' لیست دوره های خریداری شده ',
                "pagination" : pagination,
                "params" : params,
                "params_query" : params_query,
                "page" : page,
                "url" : url,
                "route_url" : route_url,
               
            }
            return res.render(this.templatePath+'orders/index',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }









}
