import BackendController from "../../core/BackendController.js";
import translate from "../../core/translate.js";
import {log, getEnv,getPath} from '../../core/utils.js';
import SettingsModel from '../../models/backend/settings.js';
import {isFile,unlink,fileExists} from '../../core/fs.js';
import {allowImageFileUpload,fileNameGenerator,toByte} from '../../core/uploader.js';



export default class SettingsController extends BackendController
{
    #url =  getEnv('BACKEND_URL') + 'settings/';

    constructor()
    {
        super();
        this.model = new SettingsModel();

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
    async #validation(req){
        await body('title').not().isEmpty().withMessage("err4").run(req);
        return validationResult(req);   
    }
    async edit(req,res){
        try{
            const back_url = this.#url + '?';
            const {params,params_query} = this.#getParams(req);
            const editId = this.toObjectId(this.input(req.params.edit_id),true);
            if(editId === '')
            {
                return res.redirect(back_url);
            }
            const rowData = await this.model.getRowSettings(editId);
            if(!rowData)
            {
                return res.redirect(back_url);
            }
            const row = rowData.toJSON();
            const currentUrl = this.#url + `edit/${editId}/?` +params_query;
            if(this.input(req.query.del) == '1')
            {
                log('del1')
                const path = getPath() + 'media/settings' + row.icon;
                await unlink(path);
                await this.model.deleteIcon(editId);
                return res.redirect(currentUrl);
            }
            if(this.input(req.query.del) == '2')
                {
                    log('del2')
                    const path = getPath() + 'media/settings' + row.logo;
                    await unlink(path);
                    await this.model.deleteLogo(editId);
                    return res.redirect(currentUrl);
                }
            if(this.input(req.query.del) == '3')
                {
                    log('del3')

                    const path = getPath() + 'media/settings' + row.logo_dark;
                    await unlink(path);
                    await this.model.deleteLogoDark(editId);
                    return res.redirect(currentUrl);
                }
                  
                           

            const data = {
                "title" : 'ویرایش   مشخصات وب سایت',
                "back_url" : back_url,
                "row" : row,
                "delUrl" : currentUrl,
            }
            return res.render(this.templatePath+'settings/edit',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async postEdit(req,res){
        try{

            
            const editId = this.toObjectId(this.input(req.params.edit_id),true);
            const url = this.#url + `edit/${editId}/?`;
            const rowData = await this.model.getRowSettings(editId);
            if(!rowData)
            {
                return res.redirect(url);
            }
           
            const row = rowData.toJSON();
            const title = this.safeString(this.input(req.body.title));
            const link_telegram = this.safeString(this.input(req.body.link_telegram));
            const link_linkdin = this.safeString(this.input(req.body.link_linkdin));
            const link_instagram = this.safeString(this.input(req.body.link_instagram));
            const email = this.safeString(this.input(req.body.email));
            const mobile = this.safeString(this.input(req.body.mobile));
            const phone = this.safeString(this.input(req.body.phone));
            const title_seo = this.safeString(this.input(req.body.title_seo));
            const address = this.input(req.body.address);
            const description_seo = this.safeString(this.input(req.body.description_seo));
            const content_birth=this.safeString(this.input(req.body.content_birth));

            if(!this.checkCsrfToken(req))
            {
                return res.redirect(`${url}&msg=csrf_token_invalid`);
            }          
            else
            {

                let icon = row?.icon ?? '';

                if(icon === "" && req?.files?.icon)
                {                    
                    if(req.files.icon.size <= toByte(1000,'MB'))
                    {
                        const ext = allowImageFileUpload(req.files.icon.mimetype);
                        if(ext !== '')
                        {
                            const fileName = 'settings/' + fileNameGenerator('icon',ext);
                            const path = getPath() + 'media/' + fileName;
                            await req.files.icon.mv(path);
                            icon = fileName;
                        }
                        else
                        {
                            return res.redirect(`${this.#url}add/?msg=upload-error-2`);
                        }
                    }
                    else
                    {
                        return res.redirect(`${this.#url}add/?msg=upload-error-1`);
                    }
                }
                
                
                //UPLOAD logo_dark
                let logo_dark = row?.logo_dark ?? '';
                if(logo_dark === "" && req?.files?.logo_dark)
                {                    
                    if(req.files.logo_dark.size <= toByte(1000,'MB'))
                    {
                        const ext = allowImageFileUpload(req.files.logo_dark.mimetype);
                        if(ext !== '')
                        {
                            const fileName = 'settings/' + fileNameGenerator('logo_dark',ext);
                            const path = getPath() + 'media/' + fileName;
                            await req.files.logo_dark.mv(path);
                            logo_dark = fileName;
                        }
                        else
                        {
                            return res.redirect(`${this.#url}add/?msg=upload-error-2`);
                        }
                    }
                    else
                    {
                        return res.redirect(`${this.#url}add/?msg=upload-error-1`);
                    }
                }

                //UPLOAD LOGO
                let logo = row?.logo ?? '';
                if(logo === "" && req?.files?.logo)
                {                    
                    if(req.files.logo.size <= toByte(1000,'MB'))
                    {
                        const ext = allowImageFileUpload(req.files.logo.mimetype);
                        if(ext !== '')
                        {
                            const fileName = 'settings/' + fileNameGenerator('logo',ext);
                            const path = getPath() + 'media/' + fileName;
                            await req.files.logo.mv(path);
                            logo = fileName;
                        }
                        else
                        {
                            return res.redirect(`${this.#url}add/?msg=upload-error-2`);
                        }
                    }
                    else
                    {
                        return res.redirect(`${this.#url}add/?msg=upload-error-1`);
                    }
                }
                
                const resultSave = await this.model.save(editId
                    ,title,mobile,phone,email,link_instagram,link_telegram,link_linkdin,address,title_seo,description_seo,content_birth,icon,logo,logo_dark);
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
    async slider(req,res){
        try{
            const pagination = await this.model.paginationSlider();

            const data = {
                "title" : "اسلایدر ها",
                "pagination" : pagination,

            }
            return res.render(this.templatePath+'settings/sliders',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async editSlider(req,res){
        const back_url = this.#url+'sliders';
        const editId = this.toObjectId(this.input(req.params.edit_id),true);
        log(editId)
        if(editId === '')
        {
            return res.redirect(back_url);
        }
        const rowData = await this.model.getRowSlider(editId);
        const row = rowData.toJSON();
        const currentUrl = this.#url + `edit_slider/${editId}/?` ;
        if(!rowData)
        {
            return res.redirect(back_url);
        }
        if(this.input(req.query.del) == '1')
            {
                const path = getPath() + 'media/img_sliders' + row.img;
                await unlink(path);
                await this.model.deleteImg(editId);
                return res.redirect(currentUrl);
            }
        
        const data = {
            "title" : 'ویرایش اسلایدر',
            "back_url" : back_url,
            "row" : row,
        }
        return res.render(this.templatePath+'settings/edit_slider',data);
    }


    async postEditSlider(req,res){
        try{
            log(req.body)
            const editId = this.toObjectId(this.input(req.params.edit_id),true);
            const url = this.#url + `edit_slider/${editId}/?`;
            const rowData = await this.model.getRowSlider(editId);
            if(!rowData)
            {
                return res.redirect(url);
            }
            const row = rowData.toJSON();
            const title = this.safeString(this.input(req.body.title));
            const link = this.safeString(this.input(req.body.link));
            const content = this.input(req.body.content);
            if(!this.checkCsrfToken(req))
            {
                return res.redirect(`${url}&msg=csrf_token_invalid`);
            }
            // const result = await this.#validation(req);
            // if(!result.isEmpty())
            // {
            //     return res.redirect(`${url}&msg=${result?.errors[0]?.msg}`);
            // }              
            else
            {

  
                //UPLOAD IMG 
                let img = row?.img ?? '';


                if(img === "" && req?.files?.img)
                {                    
                    if(req.files.img.size <= toByte(1000,'MB'))
                    {
                       const ext = allowImageFileUpload(req.files.img.mimetype);
                       if(ext !== '')
                       {
                            const fileName = 'img_sliders/' + fileNameGenerator('imgSlider',ext);
                            const path = getPath() + 'media/' + fileName;
                            await req.files.img.mv(path);
                            img = fileName;
                       }
                       else
                       {
                            return res.redirect(`${this.#url}add/?msg=upload-error-2`);
                       }
                    }
                    else
                    {
                        return res.redirect(`${this.#url}add/?msg=upload-error-1`);
                    }
                }
                
                log(img)


                const resultSave = await this.model.saveSlider(editId
                    ,title,content,link,img);
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
