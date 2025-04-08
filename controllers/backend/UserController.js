import BackendController from "../../core/BackendController.js";
import {validationResult,body} from 'express-validator';
import translate from "../../core/translate.js";
import crypto from '../../core/crypto.js';
import {isFile,unlink,fileExists} from '../../core/fs.js';
import {allowImageFileUpload,fileNameGenerator,toByte} from '../../core/uploader.js';
import {random,stringify,log, getEnv,getPath} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import AdminModel from '../../models/backend/admin.js';

export default class UserController extends BackendController
{
    #url =  getEnv('BACKEND_URL') + 'user/';

    constructor()
    {
        super();
        this.model = new AdminModel();

    }
    
    async getLogin(req,res){
        try{
            const data = {
                "form_data" : req?.session?.user_login_data
            }
            return res.render(this.templatePath+'user/login',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    


    async postLogin(req,res){
        try{
            const email = this.safeString(this.input(req.body.email));
            const password = this.input(req.body.password);
            const formData = {email};
            req.session.user_login_data = formData;
            const result = await this.#loginValidation(req);
            if(!result.isEmpty())
            {
                return res.redirect(`${this.#url}login/?msg=${result?.errors[0]?.msg}`);
            }  
            const resultLogin = await this.model.login(email,password);
            if(resultLogin?._id)
            {
                req.session.admin_id = resultLogin?._id;
                req.session.admin_info = resultLogin;
                delete req.session.user_login_data;
                return res.redirect(getEnv('BACKEND_URL'));
            }
            else
            {
                return res.redirect(`${this.#url}login/?msg=${resultLogin}`);
            }
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async #loginValidation(req){
        await body('email').not().isEmpty().withMessage("err1")
            .isEmail().withMessage("err2")
            .run(req);
        await body('password').not().isEmpty().withMessage("err3").run(req);
        return validationResult(req);   
    }


    async getLogout(req,res){
        try{
            delete req.session.admin_id;
            delete req.session.admin_info;
            req.session.destroy();
            return res.redirect(`${this.#url}login/?msg=success-logout`);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async getProfile(req,res){
        try{
            const deleteAvatar = this.input(req.query.del);
            if(deleteAvatar === "1")
            {
                const path = getPath() + 'media/' + req.session.admin_info?.avatar;
                if(fileExists(path))
                {
                    unlink(path);
                }
                await this.model.deleteAvatar(req.session.admin_id);  
                req.session.admin_info.avatar = '';
                return res.redirect(`${this.#url}profile/?msg=avatar-deleted`);
            }


            const data = {
              "title" : translate.t('user.profile'),
              "user" : req.session.admin_info
            }
            return res.render(this.templatePath+'user/profile',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async #saveProfileValidation(req){
        await body('first_name').not().isEmpty().withMessage("err1").run(req);
        await body('last_name').not().isEmpty().withMessage("err2").run(req);
        await body('email').not().isEmpty().withMessage("err3").isEmail().withMessage("err4").run(req);
        await body(['pass1','pass2','pass3']).custom(() => {
            const pass1 = this.input(req.body.pass1);
            const pass2 = this.input(req.body.pass2);
            const pass3 = this.input(req.body.pass3);
            if(pass1 !== "")
            {
                if(pass2 === "")
                {
                    throw new Error("err5");
                }
                if(pass3 === "")
                {
                    throw new Error("err6");
                }
                if(pass2 !== pass3)
                {
                    throw new Error("err7");
                }
            }
            return true;
        }).run(req);
        return validationResult(req);   
    }

    async saveProfile(req,res){
        try{
            if(!this.checkCsrfToken(req))
            {
                return res.redirect(`${this.#url}profile/?msg=csrf_token_invalid`);
            }
            const first_name = this.safeString(this.input(req.body.first_name));
            const last_name = this.safeString(this.input(req.body.last_name));
            const email = this.safeString(this.input(req.body.email));
            const pass1 = this.input(req.body.pass1);
            const pass2 = this.input(req.body.pass2);
            const pass3 = this.input(req.body.pass3);
            const result = await this.#saveProfileValidation(req);
            if(!result.isEmpty())
            {
                return res.redirect(`${this.#url}profile/?msg=${result?.errors[0]?.msg}`);
            }  
            else
            {
                let avatar = req.session.admin_info?.avatar ?? '';
                
                if(avatar === "" && req?.files?.avatar)
                {                    
                    if(req.files.avatar.size <= toByte(5,'MB'))
                    {
                       const ext = allowImageFileUpload(req.files.avatar.mimetype);
                       if(ext !== '')
                       {
                            const fileName = 'avatars/' + fileNameGenerator('avatar',ext);
                            const path = getPath() + 'media/' + fileName;
                            await req.files.avatar.mv(path);
                            avatar = fileName;
                       }
                       else
                       {
                            return res.redirect(`${this.#url}profile/?msg=upload-error-2`);
                       }
                    }
                    else
                    {
                        return res.redirect(`${this.#url}profile/?msg=upload-error-1`);
                    }
                }

                const resultSave = await this.model.saveProfile(req.session.admin_id,first_name,last_name,email
                    ,pass1,pass2,pass3,avatar);
                if(resultSave === 1)
                {
                    req.session.admin_info = await this.model.getProfile(req.session.admin_id);
                    return res.redirect(`${this.#url}profile/?msg=ok`);    
                }
                else
                {
                    return res.redirect(`${this.#url}profile/?msg=${resultSave}`);    
                }
            }
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

}