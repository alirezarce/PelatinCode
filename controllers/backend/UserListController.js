import BackendController from "../../core/BackendController.js";
import {validationResult,body} from 'express-validator';
import translate from "../../core/translate.js";
import crypto from '../../core/crypto.js';
import {isFile,unlink,fileExists} from '../../core/fs.js';
import {allowImageFileUpload,fileNameGenerator,toByte} from '../../core/uploader.js';
import {random,stringify,log, getEnv,getPath} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import UsersModel from '../../models/backend/users.js';
import GroupUsersModel from '../../models/backend/userGroup.js';
import { console } from "inspector";




export default class UserListController extends BackendController
{
    #url =  getEnv('BACKEND_URL') + 'users/';

    constructor()
    {
        super();
        this.model = new UsersModel();
        this.UserGroup = new GroupUsersModel();
    }
    async add(req,res){
        try{
            const groups = await this.UserGroup.getGroups();            
            const data = {
                "title" : 'ثبت کاربر جدید ',
                "groups":groups,
                "form_data" : req?.session?.users_add_data,
            }
            return res.render(this.templatePath+'users/add',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async postAdd(req,res){
        try{
            const fn = this.safeString(this.input(req.body.fn));
            const ln = this.safeString(this.input(req.body.ln));
            const mobile = this.safeString(this.input(req.body.mobile));
            var group_id = this.safeString(this.input(req.body.group_id));
            var date_birth =this.safeString(this.input(req.body.date_birth_shamsi));
            const address = this.safeString(this.input(req.body.address));
            const status = this.safeString(this.input(req.body.status));
            var date_birth_shamsi =date_birth;
            const date_birth_ghamari= datetime.toGregorian(date_birth_shamsi);
            const country = this.safeString(this.input(req.body.country));
            const gender = this.safeString(this.input(req.body.gender));
            if(group_id==''){
                group_id=null;
            }
            const email = this.safeString(this.input(req.body.email));
            const pass1 = this.input(req.body.pass1);
            const pass2 = this.input(req.body.pass2);
            const result = await this.#AddUserValidation(req);
            if(!this.checkCsrfToken(req))
            {
                return res.redirect(`${this.#url}add/?msg=csrf_token_invalid`);
            }
                if(!result.isEmpty())
            {
                return res.redirect(`${this.#url}add/?msg=${result?.errors[0]?.msg}`);
            }  

            console.log(req.body);
            log(2222)
            const resultAdd = await this.model.addUser(fn,ln,mobile,email,date_birth_shamsi,date_birth_ghamari,group_id,gender,country,pass1,pass2,address,status);
            
            if(resultAdd >0){
            return res.redirect(`${this.#url}add/?msg=ok`);
            } 
            if(resultAdd == -1){
                return res.redirect(`${this.#url}add/?msg=-1`);

            }
            if(resultAdd == -2){
                return res.redirect(`${this.#url}add/?msg=-2`);
            }
            if(resultAdd == -3){
                return res.redirect(`${this.#url}add/?msg=-3`);
            }
            else
            return res.redirect(`${this.#url}add/?msg=error`);



        }catch(e){
            return super.toError(e,req,res);
        }
    }

    

    async #AddUserValidation(req){
        await body('fn').not().isEmpty().withMessage("err1").run(req); 
        await body('mobile').trim().not().isEmpty().withMessage( "err2" )
            .isNumeric().withMessage("err3").isLength({ min: 11, max: 11 }).withMessage("err4").run(req)
        return validationResult(req);   
    }


    #getParams(req){
        try{
            let mobile = this.safeString(this.input(req.query.mobile));
            const email = this.safeString(this.input(req.query.email));
            const fn = this.safeString(this.input(req.query.fn));

            const params = {
                mobile,email,fn
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
            const sortFields = ['_id','mobile','email','register_date_time','verify_date_time','status'];
            const {page,sort_field,sort_type} = this.handlePagination(req,sortFields);
            log(sort_field)

            const status_id = this.toObjectId(this.input(req.query.status_id),true);
            const is_verify_id = this.toObjectId(this.input(req.query.is_verify_id),true);
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
                        return res.redirect(url + `&id=${del_id}&page=${page}&msg=delete_success`);
                    else
                        return res.redirect(url + `&page=${page}&msg=delete_error`);
                }
    
            const pagination = await this.model.pagination(page,sort_field,sort_type,params?.mobile,params?.email,params?.fn);
            const data = {
                "title" : 'لیست کاربران',
                "pagination" : pagination,
                "url" : url,
                "route_url" : route_url,
                "delete_url" : delete_url,
                "sortFields" : sortFields,
                "params" : params,
                "params_query" : params_query,
                "page" : page,

            }
            return res.render(this.templatePath+'users/index',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async edit(req,res){
        try{
            const page = this.getPage(req);
            const {params,params_query} = this.#getParams(req);
            const url = this.#url + '?' + params_query;
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
            const row = rowData.toJSON();;
            const groups = await this.UserGroup.getGroups();
            const currentUrl = this.#url + `edit/${editId}/?` + params_query + `&page=${page}`;
            const data = {
                "title" : 'ویرایش کاربر',
                "back_url" : back_url,
                "row" : row,
                "groups":groups,
            }
            return res.render(this.templatePath+'users/edit',data);
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
            const rowData = await this.model.getRow(editId);
            if(!rowData)
            {
                return res.redirect(url);
            }
            const row = rowData.toJSON();

            const fn = this.safeString(this.input(req.body.fn));
            const ln = this.safeString(this.input(req.body.ln));
            const mobile = this.safeString(this.input(req.body.mobile));
            var group_id = this.safeString(this.input(req.body.group_id));
            var date_birth =this.safeString(this.input(req.body.date_birth_shamsi));
            const address = this.safeString(this.input(req.body.address));
            var date_birth_shamsi =date_birth;
            const status = this.safeString(this.input(req.body.status));
            const date_birth_ghamari= datetime.toGregorian(date_birth,'YYYY-MM-DD');
            const country = this.safeString(this.input(req.body.country));
            const gender = this.safeString(this.input(req.body.gender));
            log(date_birth)
            log(date_birth_shamsi)
            log(date_birth_ghamari)
            if(group_id==''){
                group_id=null;
            }
            const pass1 = this.input(req.body.pass1);
            const pass2 = this.input(req.body.pass2);
            const email = this.safeString(this.input(req.body.email));
            const username = this.safeString(this.input(req.body.username));
            const password = this.safeString(this.input(req.body.password));
            if(!this.checkCsrfToken(req))
            {
                return res.redirect(`${url}&msg=csrf_token_invalid`);
            }
            const result = await this.#AddUserValidation(req);
            if(!result.isEmpty())
            {
                return res.redirect(`${url}&msg=${result?.errors[0]?.msg}`);
            }              
            else
            {
                const resultSave = await this.model.save(editId,fn,ln, mobile,email,date_birth_shamsi,date_birth_ghamari,group_id,gender,country,pass1,pass2,address,status);
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

   






   





}
