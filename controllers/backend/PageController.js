import BackendController from "../../core/BackendController.js";
import {validationResult,body} from 'express-validator';
import translate from "../../core/translate.js";
import crypto from '../../core/crypto.js';
import {isFile,unlink,fileExists} from '../../core/fs.js';
import {allowImageFileUpload,fileNameGenerator,toByte} from '../../core/uploader.js';
import {random,stringify,log, getEnv,getPath} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import PageModel from '../../models/backend/page.js';

export default class PageController extends BackendController
{
    #url =  getEnv('BACKEND_URL') + 'page/';

    constructor()
    {
        super();
        this.model = new PageModel();
    }



    async #validation(req){
        await body('title_seo').not().isEmpty().withMessage("err1").run(req);
        await body('description_seo').not().isEmpty().withMessage("err2").run(req);
        await body('content').not().isEmpty().withMessage("err3").run(req);
        return validationResult(req);   
    }


    async index(req,res){
        try{
            const url = this.#url + '?';
            const route_url = this.#url;
            const pagination = await this.model.pagination();
            const data = {
                "title" : 'لیست صفحات',
                "pagination" : pagination,
                "url" : url,
                "route_url" : route_url,
            }
            return res.render(this.templatePath+'page/index',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async edit(req,res){
        try{
            const back_url = this.#url;
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
                "title" : 'ویرایش صفحه',
                "back_url" : back_url,
                "row" : row,
            }
            return res.render(this.templatePath+'page/edit',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async postEdit(req,res){
        try{
            const editId = this.toObjectId(this.input(req.params.edit_id),true);
            const url = this.#url + `edit/${editId}/?`;
            const rowData = await this.model.getRow(editId);
            if(!rowData)
            {
                return res.redirect(url);
            }
            const row = rowData.toJSON();
            const title_seo = this.safeString(this.input(req.body.title_seo));
            const content = this.input(req.body.content);
            const description_seo = this.safeString(this.input(req.body.description_seo));
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
                const resultSave = await this.model.save(editId
                    ,title_seo,description_seo,content);
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
