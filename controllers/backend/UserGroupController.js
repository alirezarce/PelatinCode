import BackendController from "../../core/BackendController.js";
import {validationResult,body} from 'express-validator';
import translate from "../../core/translate.js";
import crypto from '../../core/crypto.js';
import {isFile,unlink,fileExists} from '../../core/fs.js';
import {allowImageFileUpload,fileNameGenerator,toByte} from '../../core/uploader.js';
import {random,stringify,log, getEnv,getPath} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import UserGroupModel from '../../models/backend/userGroup.js';

export default class UserGroupController extends BackendController
{
    #url =  getEnv('BACKEND_URL') + 'userGroup/';

    constructor()
    {
        super();
        this.model = new UserGroupModel();
    }
    
    async add(req,res){
        try{
            const logo = req.session.category_add_data?.logo ?? '';
            const data = {
                "title" : 'ثبت گروه بندی کاربران ',
                "form_data" : req?.session?.category_add_data,
                
            }
            return res.render(this.templatePath+'userGroup/add',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async #validation(req){
        await body('title').not().isEmpty().withMessage("err1").run(req);
        return validationResult(req);   
    }

    async postAdd(req,res){
        try{
            const title = this.safeString(this.input(req.body.title));
            const status = this.safeString(this.input(req.body.status));
            const description = this.safeString(this.input(req.body.description));
            const formData = {title,status,description,};
            req.session.category_add_data = formData;

            if(!this.checkCsrfToken(req))
            {
                return res.redirect(`${this.#url}add/?msg=csrf_token_invalid`);
            }
            const result = await this.#validation(req);
            if(!result.isEmpty())
            {
                return res.redirect(`${this.#url}add/?msg=${result?.errors[0]?.msg}`);
            }  
            else
            {
               

                const resultAdd = await this.model.add(title,status,description);
                if(typeof resultAdd === 'number')
                    return res.redirect(`${this.#url}add/?msg=${resultAdd}`);
                else if(resultAdd?._id)
                {
                    delete req.session.category_add_data;
                    return res.redirect(`${this.#url}add/?msg=ok`);
                }
                else
                    return res.redirect(`${this.#url}add/?msg=error`);
            }
        }
        catch(e){
            return super.toError(e,req,res);
        }
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
            const sortFields = ['_id','title','last_edit_date_time','status'];
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
                const delRow = await this.model.getRow(del_id);
                const path = getPath() + 'media/' + delRow.logo;
                await unlink(path);
                const resultDelete =  await this.model.deleteRow(del_id);
                if(resultDelete === 1)
                    return res.redirect(url + `&page=${page}&msg=delete_success`);
                else
                    return res.redirect(url + `&page=${page}&msg=delete_error`);
            }

            const pagination = await this.model.pagination(page,sort_field,sort_type,params?.title);
            const data = {
                "title" : 'لیست گروه بندی کاربران ',
                "pagination" : pagination,
                "url" : url,
                "route_url" : route_url,
                "delete_url" : delete_url,
                "sortFields" : sortFields,
                "params" : params,
                "params_query" : params_query,
                "page" : page,
            }
            return res.render(this.templatePath+'userGroup/index',data);
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
            const currentUrl = this.#url + `edit/${editId}/?` + params_query + `&page=${page}`;
            if(this.input(req.query.del) == '1')
            {
                const path = getPath() + 'media/' + row.logo;
                await unlink(path);
                await this.model.removeLogo(editId);
                return res.redirect(currentUrl);
            }
            const data = {
                "title" : 'ویرایش گروه بندی کاربران',
                "back_url" : back_url,
                "row" : row,
                "delUrl" : currentUrl,
            }
            return res.render(this.templatePath+'userGroup/edit',data);
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
            const title = this.safeString(this.input(req.body.title));
            const status = this.safeString(this.input(req.body.status));
            const description = this.safeString(this.input(req.body.description));
          
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
                
                const resultSave = await this.model.save(editId,title,status
                    ,description);
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
