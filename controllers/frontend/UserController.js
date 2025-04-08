import FrontendController from "../../core/FrontendController.js";
import {Redis,Amqp} from "../../global.js";
import {log, getEnv,random,getPath,generateOtp,hasKey,generateOtpResetPassword} from '../../core/utils.js';
import crypto from '../../core/crypto.js';
import {validationResult,body} from 'express-validator';
import  UserModel from '../../models/frontend/user.js';
import  OrderModel from '../../models/frontend/order.js';
import BlogModel from '../../models/frontend/blogList.js';
import OnlineCourseModel from '../../models/frontend/onlineCourse.js';
import OfflineCourseModel from '../../models/frontend/offlineCourse.js';
import mailSend from '../../core/mail.js';
import datetime from '../../core/datetime.js';
import {allowImageFileUpload,fileNameGenerator,toByte} from '../../core/uploader.js';
import {isFile,unlink,fileExists} from '../../core/fs.js';
import axios from 'axios';



export default class UserController extends FrontendController
{
    #url =  getEnv('FRONTEND_URL') + 'user/';

    constructor()
    {
        super();
        this.model = new UserModel();
        this.orderModel=new OrderModel();
        this.BlogModel = new BlogModel();
        this.onlineCourseModel = new OnlineCourseModel();
        this.offlineCourseModel = new OfflineCourseModel();


    }
    
    async getLogin(req,res){
        try{
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
            const getSettings = await this.globalModel.getSettings();
            const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
            const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
            const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
            const data = {
                "title" : "ورود به سایت",
                "description" : "ورود به سایت",
                "form_data" : req.session?.user_login_data,
                "allCategoryBlog" : getAllCategoryBlog,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                "setting":getSettings,

            };  
            return res.render(this.templatePath + 'user/login.html',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async #loginValidation(req){
        await body('mobile').trim().not().isEmpty().withMessage(" موبایل را وارد کنید " ).isNumeric().withMessage("موبایل باید عدد باشد").isLength({ min: 11, max: 11 }).withMessage("موبایل باید ۱۱ رقم باشد").run(req)
        await body('password').trim().not().isEmpty().withMessage("لطفا رمز عبور خود را وارد کنید").run(req)
        return validationResult(req);   
    }

    async postLogin(req,res){
        try{
            let mobile = this.safeString(this.input(req.body.mobile));
            const password = this.input(req.body.password);
            const formData = {mobile};
            req.session.user_login_data = formData;
            const result = await this.#loginValidation(req);
            if(!result.isEmpty())
            {
                return  res.json({success:false, message:`${result?.errors[0]?.msg}`});
            }  
            const resultLogin = await this.model.login(mobile,password);
            if(resultLogin?._id)
            {
                delete req.session.user_login_data;
                req.session.user_id = resultLogin?._id;
                req.session.user_info = resultLogin;
                return res.json({ success: true, message: 'login success' });
            }
            else
            {
                 return  res.json({ success: false, message: 'موبایل یا رمز عبور اشتباه است' });

            }
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async getRegister(req,res){
        try{
            const getSettings = await this.globalModel.getSettings();
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
            const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
            const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
             const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
            const data = {
                "title" : "ثبت نام",
                "description" : "ثبت نام",
                "allCategoryBlog" : getAllCategoryBlog,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                "setting":getSettings,
                //"mainCategory" : await this.getMainCategoryList(),
                "form_data" : req.session?.user_register_data
            };  
            return res.render(this.templatePath + 'user/register.html',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async #registerValidation(req){
        
    await body('mobile').trim().not().isEmpty().withMessage(" موبایل را وارد کنید " ).isNumeric().withMessage("موبایل باید عدد باشد").isLength({ min: 11, max: 11 }).withMessage("موبایل باید ۱۱ رقم باشد").run(req)
    await body('password').trim().not().isEmpty().withMessage("لطفا رمز عبور خود را وارد کنید").run(req)
    await body('confirm_password').trim().not().isEmpty().withMessage("لطفاتکرار  رمز عبور خود را وارد کنید").run(req)
    await body(['password','confirm_password']).custom(() => {
        const password = this.input(req.body.password);
        const confirm_password = this.input(req.body.confirm_password);
        if(password == confirm_password)
        {
            return true;
        }
        else
        {
            throw new Error("تکرار کلمه عبور صحیح نمی باشد.؛");
        }
    }).run(req);
   
        return validationResult(req);   
    }

    async postRegister(req,res){
        try{
            log('register')
            let mobile = this.safeString(this.input(req.body.mobile));
            const password = this.safeString(this.input(req.body.password));
            const confirm_password = this.safeString(this.input(req.body.confirm_password));
            //req.session.user_register_data = formData;
            const result = await this.#registerValidation(req);
            if(!result.isEmpty())
            {
                return  res.json({success:false, message:`${result?.errors[0]?.msg}`});

            }  
            const resultOtp = await Redis.getHash(getEnv('REDIS_REGISTER_OTP') + mobile);
            if (hasKey(resultOtp, 'mobile') && resultOtp.mobile === mobile) {
                res.json({ success:false,message:"  کد تایید ارسال شد لطفا برای ارسال مجدد چندلحظه صبر کنید " });
                return;
            }   
            const checkMobile = await this.model.checkMobile(mobile);
            if (checkMobile == 0) {
                const otp = generateOtp(mobile,confirm_password);
                
                
                const myJsonData = {
                    message: "Send Otp Register!",
                    timestamp: new Date(),
                    mobile:mobile,
                    otp:otp,
                    type:"otp"
                };
                //const message = JSON.stringify(myJsonData);
                Amqp.sendSms('sms-register',myJsonData)
               res.json({ success: true, message: 'کد تایید ارسال شد.' });
                return;
            }
            else {
                res.json({success:false, message: "موبایل تکراری است"});
            }
    
                            
                    
        }
                
             
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async verifyOtp(req,res){
        try{   
            log('verfy-otp')       
            let mobile = this.safeString(req.body.mobile);
            let otp = this.safeString(req.body.otp);
            if (!mobile.startsWith("09")) {
                res.json({ "result": "موبایل باید با ۰۹ شروع شود", "code": "25" });
                return;
            }

            const resultOtp = await Redis.getHash(getEnv('REDIS_REGISTER_OTP')+mobile);
           const resultRegister= await this.model.register(resultOtp.mobile, resultOtp.password);

            //Creat user Sky room 
            const res_api=await axios
            .post('https://www.skyroom.online/skyroom/api/apikey-31625588-6-052b7f494bab5ff1ffcb16c8b12bcee3',
                {
                    "action": "createUser",
                    params: { 
                        "username": resultOtp.mobile,
                        "password": resultOtp.password,
                        "nickname": "کاربر عمومی",
                        "status": 1,
                        "is_public": true
                    }
                  });
            const user_id=res_api.data.result;
            await this.model.saveSkyRoomUserId(resultRegister,user_id);
            if (hasKey(resultOtp, 'otp') && resultOtp.otp === otp) {
                const currentUser = await this.model.getUserByMobile(resultOtp.mobile);
                if(currentUser && !currentUser.is_verify)
                    {   
                        await this.model.verifyUser(currentUser._id);
                        await Redis.del(getEnv('REDIS_REGISTER_OTP') + mobile);
                    }
                
                res.json({ success: true, message: 'شماره موبایل تایید شد.' });
            }
            else {
                res.json({ success: false, message: 'کد تایید اشتباه است.' });

            }

           
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }




    


    async getRegisterSendLink(req,res){
        try{
            const data = {
                "title" : "ارسال لینک فعال سازی",
                "description" : "ارسال لینک فعال سازی",
                "mainCategory" : await this.getMainCategoryList(),
            };  
            return res.render(this.templatePath + 'user/register-send-link.html',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }





    async getRegisterActive(req,res){
        try{
            const key = this.safeString(req.params.key).trim();
            const token = this.safeString(req.params.token).trim();
            if(key=='' || token == '')
            {
                return res.redirect(`${getEnv('FRONTEND_URL')}`);
            }
            const userToken = await Redis.getHash('register_'+key);
            if(userToken && userToken?.token && userToken?.token === token)
            {
                const currentUser = await this.model.getRow(userToken?.user_id);
                if(currentUser && !currentUser.is_verify)
                {   
                    await this.model.verifyUser(currentUser._id);
                    await Redis.del('register_'+key);
                }
                return res.redirect(`${this.#url}login/?msg=active-account`);
            }
            else
            {
                return res.redirect(`${this.#url}login/?msg=active-account`);
            }
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async getLogout(req,res){
        try{
            delete req.session.user_id;
            delete req.session.user_info;
            req.session.destroy();
            return res.redirect(`${this.#url}login/?msg=success-logout`);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }



    async getDashboard(req,res){
        try{
            const userInfo = await this.model.getRow(req?.session?.user_id);
            const url = this.#url + 'my-video/';
            const user_id=req?.session?.user_id;
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
            const getSettings = await this.globalModel.getSettings();
            const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
            const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
            const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
            const getAllOrder= await this.orderModel.getOrderByUserId(user_id);
            const getCountOrder= await this.orderModel.getCountOrderByUserId(user_id);
            const getLastBlog = await this.BlogModel.getLastBlog();
            const getTotalPrice = await this.orderModel.totalPriceByUserId(user_id);
           const getTypeOrder=await this.orderModel.getOrderTypeByUserId(user_id);
           const type=getTypeOrder.map(order => order.type);
          var url_skyroom="";
            for (const order of getAllOrder.orders) {
                if(order.type==1){
                    const course = await this.onlineCourseModel.getCourse(order.slug);
                    const data_skyroom= await axios
                    .post('https://www.skyroom.online/skyroom/api/apikey-31625588-6-052b7f494bab5ff1ffcb16c8b12bcee3',
                        {
                            action: 'getRoomUrl',
                            "params": {
                            "room_id": course?.skyRoom_id,
                            "language": "fa"
                            }
                        });
                    url_skyroom=data_skyroom.data.result;
                   
                }
            }
            log(url_skyroom);
            const data = {
                "title" : "داشبورد",
                "description" : "داشبورد",
                "userInfo":userInfo,
                "allCategoryBlog" : getAllCategoryBlog,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                "setting":getSettings,
                "countOrder":getCountOrder,
                "allOrder":getAllOrder,
                "lastBlog":getLastBlog,
                "url":url,
                "urlSkyroom":url_skyroom
            };  
            return res.render(this.templatePath + 'user/dashboard.html',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async getProgressChallengeValue(user_id,challenge_id){
        try{
            return await this.model.getProgressChallengeValue(user_id,challenge_id);
        }
        catch(e){
            return e.toString();
        }
    }



    async getRecovery(req,res){
        try{
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
            const getSettings = await this.globalModel.getSettings();
            const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
            const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
            const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
            const data = {
                "title" : "بازیابی حساب کاربری",
                "description" : "بازیابی حساب کاربری",
                "allCategoryBlog" : getAllCategoryBlog,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                "setting":getSettings,
              
            };  
            return res.render(this.templatePath + 'user/recovery.html',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }



    async #recoveryValidation(req){
        await body('mobile').trim().not().isEmpty().withMessage(" موبایل را وارد کنید " ).isNumeric().withMessage("موبایل باید عدد باشد").isLength({ min: 11, max: 11 }).withMessage("موبایل باید ۱۱ رقم باشد").run(req)
        return validationResult(req);   
    }

    async postRecovery(req,res){
        try{
            let mobile = this.safeString(this.input(req.body.mobile));
            const result = await this.#recoveryValidation(req);
            if(!result.isEmpty())
            {
                return  res.json({success:false, message:`${result?.errors[0]?.msg}`});
            }  
            const  currentUser = await this.model.getUserByMobile(mobile)
            log(currentUser)
            if(currentUser != null)
            {
                const otp = generateOtpResetPassword(mobile);
                console.log(otp);
                const myJsonData = {
                    message: "Send Otp ResetPss!",
                    timestamp: new Date(),
                    mobile:mobile,
                    otp:otp,
                    type:"otp"
                };
                //const message = JSON.stringify(myJsonData);
                Amqp.sendSms('sms-reset-pass',myJsonData)
               res.json({ success: true, message: 'کد تایید ارسال شد.' });
            }
            else
            {
                res.json({ success: false, message: ' شماره موبایل کاریر یافت نشد' });
            }
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async verifyOtpRecovery(req,res){
        try{   
            log('verfy-otp-recovery')       
            let mobile = this.safeString(req.body.mobile);
            let otp = this.safeString(req.body.otp);
            if (!mobile.startsWith("09")) {
                res.json({ "result": "موبایل باید با ۰۹ شروع شود", "code": "25" });
                return;
            }

            const resultOtp = await Redis.getHash(getEnv('REDIS_RESETPASS_OTP')+mobile);
            await this.model.resetPassword(resultOtp.mobile, resultOtp.password);
                // console.log(resultOtp);
            if (hasKey(resultOtp, 'otp') && resultOtp.otp === otp) {
                const currentUser = await this.model.getUserByMobile(resultOtp.mobile);
                if(currentUser && !currentUser.is_verify)
                    {   
                        await this.model.verifyUser(currentUser._id);
                        await Redis.del(getEnv('REDIS_RESETPASS_OTP') + mobile);
                    }
                
                res.json({ success: true, message: 'شماره موبایل تایید شد.' });
            }
            else {
                res.json({ success: false, message: 'کد تایید اشتباه است.' });

            }

           
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async getResetPassword(req,res){
        try{
            
            const getSettings = await this.globalModel.getSettings();
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
            const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
            const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
             const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
            const data = {
                "title" : "  بازیابی حساب کاربری ",
                "description" : "  بازیابی حساب کاربری ",
                "allCategoryBlog" : getAllCategoryBlog,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                "setting":getSettings,
                "form_data" : req.session?.user_register_data
            };
            return res.render(this.templatePath + 'user/reset-password.html',data);
        }
        catch(e){
            log(e);
            return super.toError(e,req,res);
        }
    }

    async #resetPasswordValidation(req){  
    await body('mobile').trim().not().isEmpty().withMessage(" موبایل را وارد کنید " ).isNumeric().withMessage("موبایل باید عدد باشد").isLength({ min: 11, max: 11 }).withMessage("موبایل باید ۱۱ رقم باشد").run(req)
    await body('password').trim().not().isEmpty().withMessage("لطفا رمز عبور خود را وارد کنید").run(req)
    await body('confirm_password').trim().not().isEmpty().withMessage("لطفاتکرار  رمز عبور خود را وارد کنید").run(req)
    await body(['password','confirm_password']).custom(() => {
        const password = this.input(req.body.password);
        const confirm_password = this.input(req.body.confirm_password);
        if(password == confirm_password)
        {
            return true;
        }
        else
        {
            throw new Error("تکرار کلمه عبور صحیح نمی باشد.؛");
        }
    }).run(req);
   
        return validationResult(req);   
    }

    async postResetPassword(req,res){
        try{
            log('resetPss')
            let mobile = this.safeString(this.input(req.body.mobile));
            const password = this.safeString(this.input(req.body.password));
            const confirm_password = this.safeString(this.input(req.body.confirm_password));
            //req.session.user_register_data = formData;
            const result = await this.#resetPasswordValidation(req);
            if(!result.isEmpty())
            {
                return  res.json({success:false, message:`${result?.errors[0]?.msg}`});

            }  
            const resultOtp = await Redis.getHash(getEnv('REDIS_RESETPASS_OTP') + mobile);
            if (hasKey(resultOtp, 'mobile') && resultOtp.mobile === mobile) {
                res.json({ success:false,message:"  کد تایید ارسال شد لطفا برای ارسال مجدد چندلحظه صبر کنید " });
                return;
            }   
            
            const  currentUser = await this.model.getUserByMobile(mobile)
            log(currentUser)
            if(currentUser != null)
                {
                //console.log(otp);
                const otp = generateOtpResetPassword(mobile,confirm_password);
                //sendSms(mobile,otp,"reset-pass");
                const myJsonData = {
                    message: "Send Otp ResetPssword!",
                    timestamp: new Date(),
                    mobile:mobile,
                    otp:otp,
                    type:"otp"
                };
                //const message = JSON.stringify(myJsonData);
                Amqp.sendSms('sms-resetpass',myJsonData)
               res.json({ success: true, message: 'کد تایید ارسال شد.' });
                return;
            }
            else {
                res.json({success:false, message: "کاربر یافت نشد "});
            }
    
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
                const path = getPath() + 'media/' + req.session.user_info?.avatar;
                if(fileExists(path))
                {
                    unlink(path);
                }
                await this.model.deleteAvatar(req.session.user_id);  
                req.session.user_info.avatar = '';
                return res.redirect(`${this.#url}profile/?msg=avatar-deleted`);
            }
            const user = await this.model.getRow(req?.session?.user_id);
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
            const getSettings = await this.globalModel.getSettings();
            const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
            const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
            const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
            const data = {
                "title" : "پروفایل",
                "description" : "پروفایل",
                "allCategoryBlog" : getAllCategoryBlog,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                "setting":getSettings,
                "user" : user,
                "avatar" : user?.avatar,
            };  
            return res.render(this.templatePath + 'user/profile.html',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async postProfile(req,res){
        try{
                let fn = this.safeString(this.input(req.body.fn));
                let ln = this.safeString(this.input(req.body.ln));
                let email = this.safeString(this.input(req.body.email));
                const pass1 = this.safeString(this.input(req.body.password1));
                const pass2 = this.safeString(this.input(req.body.password2));
                const pass3 = this.safeString(this.input(req.body.password3));  
                const date_birth_shamsi =this.safeString(this.input(req.body.date_birth_shamsi));  
                const address = this.safeString(this.input(req.body.address));
                const date_birth_ghamari= datetime.toGregorian(date_birth_shamsi);  
                let avatar = req.session.user_info?.avatar ?? '';
                // console.log(date_birth_shamsi);
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
                const resultSave = await this.model.save(req.session.user_id,fn,ln,email,date_birth_shamsi,date_birth_ghamari,pass1,pass2,pass3,address,avatar);
                if(resultSave === 1)
                {
                   const  userInfo = await this.model.getRow(req.session.user_id);
                    const res_api=await axios
            .post('https://www.skyroom.online/skyroom/api/apikey-31625588-6-052b7f494bab5ff1ffcb16c8b12bcee3',
                {
                    "action": "updateUser",
                    params: { 
                        "user_id": userInfo?.skyRoomUser_id,
                        "nickname":fn+ln,
                        "status": 1,
                    }
                  });
                    return res.redirect(`${this.#url}profile/?msg=ok`);    
                }
                else
                {
                    return res.redirect(`${this.#url}profile/?msg=${resultSave}`);    
                }
            }
        //}
        catch(e){
            return super.toError(e,req,res);
        }
    }




    async #saveProfileValidation(req){
        await body('username').not().isEmpty().withMessage("err1").custom(() => {
            const username = this.input(req.body.username);
            const check = /^[a-z0-9-]+$/.test( username );
            if(check)
                return true;
            else
                throw new Error("err2");
        }).run(req);    
        await body(['password1','password2','password3']).custom(() => {
            const pass1 = this.input(req.body.password1);
            const pass2 = this.input(req.body.password2);
            const pass3 = this.input(req.body.password3);
            if(pass1 !== "")
            {
                if(pass2 === "")
                {
                    throw new Error("err3");
                }
                if(pass3 === "")
                {
                    throw new Error("err4");
                }
                if(pass2 !== pass3)
                {
                    throw new Error("err5");
                }
            }
            return true;
        }).run(req);
        return validationResult(req);   
    }



   async getVideo(req,res){
        try{
            log('getVideo')
            const type = req.params.type;
            const slug = this.safeString(req.params.slug); 
            
            let Course = null;
            let Videos =null;
            switch(type)
            {
                case '1':
                    Course = await this.onlineCourseModel.getCourse(slug);
                    var x =await this.orderModel.checkExpireOrder(req.session.user_id,Course._id);
                    if(x){
                        return res.redirect(this.#url+'/dashboard?msg=expire');
                    }
                    else 
                    Videos =await this.onlineCourseModel.getVideoCourse(Course._id);
                    
                     
                break;
                case '2':
                    Course = await this.offlineCourseModel.getCourse(slug);
                    var x =await this.orderModel.checkExpireOrder(req.session.user_id,Course._id);
                    if(x){
                        return res.redirect(this.#url+'/dashboard?msg=expire');
                    } 
                    else
                    Videos =await this.offlineCourseModel.getVideoCourse(Course._id);
                    
                break;    
                case '3':
                    Course = await this.faceTofaceCourseModel.getCourse(slug);
                break;
                default:
                    return res.redirect(this.#url);
                break;
            }


            const title = this.safeString(req.params.title);
            const userInfo = await this.model.getRow(req?.session?.user_id);
            const user_id=req?.session?.user_id
            const getAllCategoryBlog = await this.globalModel.getCategoryBlogListAll();
            const getSettings = await this.globalModel.getSettings();
            const getAllCategoryOfflineCourse = await this.globalModel.getCategoryOffileCoursListAll();
            const getAllCategoryOnlineCourse = await this.globalModel.getCategoryOnlineCoursListAll();
            const getAllCategoryFaceToFaceCourse = await this.globalModel.getCategoryFaceToFaceCoursListAll();
            const getLastBlog = await this.BlogModel.getLastBlog();
            console.log(Videos)
            const data = {
                "title" : "نمایش ویدیو",
                "description" : "نمایش ویدیو",
                "userInfo":userInfo,
                "allCategoryBlog" : getAllCategoryBlog,
                "allCategoryOfflineCourse" : getAllCategoryOfflineCourse,
                "allCategoryOnlineCourse" : getAllCategoryOnlineCourse,
                "allCategoryFceToFaceCourse" : getAllCategoryFaceToFaceCourse,
                "setting":getSettings,
                "lastBlog":getLastBlog,
                "allVideo":Videos,
                
            };  
            return res.render(this.templatePath + 'user/my-video.html',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }






}
