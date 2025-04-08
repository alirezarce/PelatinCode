import BackendController from "../../core/BackendController.js";
import {validationResult,body} from 'express-validator';
import translate from "../../core/translate.js";
import crypto from '../../core/crypto.js';
import {isFile,unlink,fileExists} from '../../core/fs.js';
import {allowImageFileUpload,fileNameGenerator,toByte} from '../../core/uploader.js';
import {random,stringify,log, getEnv,getPath} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import CategoryBlogModel from '../../models/backend/categoryBlog.js';

export default class CategoryBlogController extends BackendController
{
    #url =  getEnv('BACKEND_URL') + 'categoryBlog/';

    constructor()
    {
        super();
        this.model = new CategoryBlogModel();
    }
    
    async add(req,res){
        try{
            if(this.input(req.query.del) == '1')
            {
                const path = getPath() + 'media/' + req.session.category_add_data.logo;
                await unlink(path);
                req.session.category_add_data.logo = '';
                return res.redirect(`${this.#url}add/`);
            }
            const mainCategory = await this.model.getMainCategoryList();
            const logo = req.session.category_add_data?.logo ?? '';
            const data = {
                "title" : 'ثبت دسته بندی وبلاگ جدید',
                "form_data" : req?.session?.category_add_data,
                "mainCategory" : mainCategory,
                "logo" : logo
            }
            return res.render(this.templatePath+'categoryBlog/add',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async #validation(req){
        await body('title').not().isEmpty().withMessage("err2").run(req);
        await body('title_seo').not().isEmpty().withMessage("err3").run(req);
        await body('description_seo').not().isEmpty().withMessage("err4").run(req);
        await body('description').not().isEmpty().withMessage("err7").run(req);
        await body('slug').not().isEmpty().withMessage("err5").custom(() => {
            const slug = this.input(req.body.slug);
            const check = /^[a-z0-9-]+$/.test( slug );
            if(check)
                return true;
            else
                throw new Error("err6");
        }).run(req);
        return validationResult(req);   
    }

    async postAdd(req,res){
        try{
            const title = this.safeString(this.input(req.body.title));
            const status = this.safeString(this.input(req.body.status));
            const title_seo = this.safeString(this.input(req.body.title_seo));
            const description_seo = this.safeString(this.input(req.body.description_seo));
            const description = this.safeString(this.input(req.body.description));
            const slug = this.safeString(this.input(req.body.slug));
            let logo = req.session.category_add_data?.logo ?? '';
            if(logo == '' && req?.files?.logo)    
            {
                const ext = allowImageFileUpload(req.files.logo.mimetype);
                if(ext !== '')
                {
                     const fileName = 'category_blog/' + fileNameGenerator('logo',ext);
                     const path = getPath() + 'media/' + fileName;
                     await req.files.logo.mv(path);
                     logo = fileName;
                }
            }
            const formData = {title,status,title_seo,description_seo,slug,description,logo};
            req.session.category_add_data = formData;
            if(logo == '')
            {
                return res.redirect(`${this.#url}add/?msg=no-logo`);
            }
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
                

                const resultAdd = await this.model.add(title,status,title_seo
                    ,description_seo,slug,description,logo);
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

            const mainCategory = await this.model.getMainCategoryList();
            const pagination = await this.model.pagination(page,sort_field,sort_type,params?.title);
            const data = {
                "title" : 'لیست دسته بندی وبلاگ ها',
                "pagination" : pagination,
                "url" : url,
                "route_url" : route_url,
                "delete_url" : delete_url,
                "sortFields" : sortFields,
                "mainCategory" : mainCategory,
                "params" : params,
                "params_query" : params_query,
                "page" : page,
            }
            return res.render(this.templatePath+'categoryBlog/index',data);
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
            const mainCategory = await this.model.getMainCategoryList();
            const data = {
                "title" : 'ویرایش دسته بندی وبلاگ',
                "back_url" : back_url,
                "mainCategory" : mainCategory,
                "row" : row,
                "delUrl" : currentUrl,
            }
            return res.render(this.templatePath+'categoryBlog/edit',data);
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
            const title_seo = this.safeString(this.input(req.body.title_seo));
            const description_seo = this.safeString(this.input(req.body.description_seo));
            const description = this.safeString(this.input(req.body.description));
            const slug = this.safeString(this.input(req.body.slug));
            let logo = row?.logo ?? '';
            if(logo == '' && req?.files?.logo)    
            {
                const ext = allowImageFileUpload(req.files.logo.mimetype);
                if(ext !== '')
                {
                     const fileName = 'category_blog/' + fileNameGenerator('logo',ext);
                     const path = getPath() + 'media/' + fileName;
                     await req.files.logo.mv(path);
                     logo = fileName;
                }
            }
            if(logo == '')
            {
                return res.redirect(`${url}&msg=no-logo`);
            }
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
                    ,title_seo,description_seo,slug,description,logo);

                    log(resultSave)
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
