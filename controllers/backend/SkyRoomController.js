import BackendController from "../../core/BackendController.js";
import {validationResult,body} from 'express-validator';
import translate from "../../core/translate.js";
import crypto from '../../core/crypto.js';
import {isFile,unlink,fileExists} from '../../core/fs.js';
import {allowImageFileUpload,fileNameGenerator,toByte} from '../../core/uploader.js';
import {random,stringify,log, getEnv,getPath} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import SkyRoomModel from '../../models/backend/skyRoom.js';
import axios from 'axios';
import user from "../../schemas/user.js";


export default class SkyRoomController extends BackendController
{
    #url =  getEnv('BACKEND_URL') + 'skyRoom/';

    constructor()
    {
        super();
        this.model = new SkyRoomModel();
    }
    
    async add(req,res){
        try{
            const data = {
                "title" : " ثبت skRoom جدید",
                "form_data" : req?.session?.sky_room_add_data,
            }
            return res.render(this.templatePath + 'skyRoom/add',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async #validation(req){
        await body('user_name').not().isEmpty().withMessage("err1").run(req);
        return validationResult(req);   
    }

    async postAdd(req,res){
        try{
            const title = this.safeString(this.input(req.body.title));
            const name = this.safeString(this.input(req.body.name));
            const max_users = this.safeString(this.input(req.body.max_users));
            const status = this.safeString(this.input(req.body.status));
            // const formData = {user_name,password,status};
            // req.session.sky_room_add_data = formData;

            const res_api=await axios
            .post('https://www.skyroom.online/skyroom/api/apikey-31625588-6-052b7f494bab5ff1ffcb16c8b12bcee3',
                {
                    "action": "createRoom",
                },{
                    params: { 
                        name:name,
                        title: title,
                        "guest_login": false,
                        "op_login_first": true,
                        max_users:max_users ,
                    }
                  },{
                  });

                  log(res_api.data);
            if(!this.checkCsrfToken(req))
            {
                return res.redirect(`${this.#url}add/?msg=csrf_token_invalid`);
            }

            else
            {
                

    
                    return res.redirect(`${this.#url}add/?msg=ok`);
               
            }
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    #getParams(req){
        try{
            
            const user_name = this.safeString(this.input(req.query.user_name));
            const params = {
                user_name
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
            const sortFields = ['_id','user_name','last_edit_date_time','status'];
            const {page,sort_field,sort_type} = this.handlePagination(req,sortFields);
            const status_id = this.toObjectId(this.input(req.query.status_id),true);
            const status_value = this.toNumber(this.input(req.query.status_value),true);
            const del_id = this.toObjectId(this.input(req.query.del_id),true);
            const {params,params_query} = this.#getParams(req);
            const url = this.#url + '?' + params_query;
            const route_url = this.#url;
            const delete_url = url + `&page=${page}`;
            if(status_id !== '')
            {
                await this.model.changeStatus(status_id,status_value);
                return res.redirect(url + `&page=${page}&msg=status_changed`);
            }

            if(del_id !== '')
            {
                const resultDelete =  await this.model.deleteRow(del_id);
                if(resultDelete === 1)
                    return res.redirect(url + `&page=${page}&msg=delete_success`);
                else
                    return res.redirect(url + `&page=${page}&msg=delete_error`);
            }

            const data_skyroom=await axios
            .post('https://www.skyroom.online/skyroom/api/apikey-31625588-6-052b7f494bab5ff1ffcb16c8b12bcee3',
                {
                    action: 'getServices',
                });

            const pagination = await this.model.pagination(page,sort_field,sort_type,params?.user_name);
            const data = {
                "title" : 'لیست  سرویس ها',
                "pagination" : pagination,
                "url" : url,
                "route_url" : route_url,
                "delete_url" : delete_url,
                "sortFields" : sortFields,
                "params" : params,
                "params_query" : params_query,
                "page" : page,
                "data_skyroom":data_skyroom.data
            }
            return res.render(this.templatePath + 'skyRoom/index',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async indexRooms(req,res){
        try{
            const sortFields = ['_id','user_name','last_edit_date_time','status'];
            const {page,sort_field,sort_type} = this.handlePagination(req,sortFields);
            const del_id = this.safeString(this.input(req.query.del_id),true);
            log(del_id)
            const {params,params_query} = this.#getParams(req);
            const url = this.#url + 'rooms/'+'?' + params_query;
            const route_url = this.#url;
            const delete_url = url ;
            const url_users = this.#url + 'getRoomUsers/';
            if(del_id !== '')
            {
                const data_skyroom= await axios
            .post('https://www.skyroom.online/skyroom/api/apikey-31625588-6-052b7f494bab5ff1ffcb16c8b12bcee3',
                {
                    action: 'deleteRoom',
                    params: { room_id: Number(del_id) },
                  });
                //const resultDelete =  await this.model.deleteRow(del_id);
                
                    return res.redirect(url + `&page=${page}&msg=delete_success`);
                
            }

            const data_skyroom= await axios
            .post('https://www.skyroom.online/skyroom/api/apikey-31625588-6-052b7f494bab5ff1ffcb16c8b12bcee3',
                {
                    action: 'getRooms',
                });
    
            const pagination = await this.model.pagination(page,sort_field,sort_type,params?.user_name);
            const data = {
                "title" : 'لیست اتاق ها ',
                "pagination" : pagination,
                "url" : url,
                "route_url" : route_url,
                "delete_url" : delete_url,
                "sortFields" : sortFields,
                "params" : params,
                "params_query" : params_query,
                "page" : page,
                "url_users" : url_users,
                "data_skyroom":data_skyroom.data
            }
            return res.render(this.templatePath + 'skyRoom/index_rooms',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async edit(req,res){
        try{
            const page = this.getPage(req);
            const {params,params_query} = this.#getParams(req);
            const back_url = this.#url + '?' + params_query + `&page=${page}`;
            const editId = this.toObjectId(this.input(req.params.edit_id),true);
            if(editId === '')
            {
                return res.redirect(back_url);
            }
            const rowData = await this.model.getRow(editId);
            if(!rowData)
            {
                return res.redirect(back_url);
            }
            const row = rowData.toJSON();
            const data = {
                "title" :"ویرایش skyRoom",
                "back_url" : back_url,
               
                "row" : row,
            }
            return res.render(this.templatePath + 'skyRoom/edit',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async postEdit(req,res){
        try{
            const page = this.getPage(req);
            const {params,params_query} = this.#getParams(req);
            const editId = this.toObjectId(this.input(req.params.edit_id),true);
            const url = this.#url + `edit/${editId}/?` + params_query + `&page=${page}`;
            const user_name = this.safeString(this.input(req.body.user_name));
            const password = this.safeString(this.input(req.body.password));
            const status = this.safeString(this.input(req.body.status));
            if(!this.checkCsrfToken(req))
            {
                return res.redirect(`${url}&msg=csrf_token_invalid`);
            }
            const result = await this.#validation(req);
            if(!result.isEmpty())
            {
                return res.redirect(`${url}&msg=${result?.errors[0]?.msg}`);
            }              
            else
            {
                const resultSave = await this.model.save(editId,user_name,password,status);
                if(resultSave === 1)
                    return res.redirect(`${url}&msg=ok`);
                else
                    return res.redirect(`${url}&msg=${resultSave}`);
            }

        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async getRoomUsers(req,res){
        try{
            const room_id = this.safeString(this.input(req.params.room_id));
            const result= await axios
            .post('https://www.skyroom.online/skyroom/api/apikey-31625588-6-052b7f494bab5ff1ffcb16c8b12bcee3',
                {
                action: 'getRoomUsers',
                params: { "room_id": Number(room_id)},
                });
                if(!Object.keys(result.data.result).length > 0 )
                {
                    return res.redirect
                    (`${this.#url}?msg=error-getRoomUsers}`);
                }
                else{
                    const data = {
                        "title" : ' لیست کاربران دارای دسترسی به اتاق',
                        "data_users" : result.data,
                    }
                    return res.render(this.templatePath + 'skyRoom/index_users',data);
                }

        }
        
        catch(e){
            return super.toError(e,req,res);
        }
    }






}
