import BackendController from "../../core/BackendController.js";
import translate from "../../core/translate.js";
import {log, getEnv,replacePlaceholders} from '../../core/utils.js';
import UsersModel from '../../models/backend/users.js';
import UserGroupModel from "../../models/backend/userGroup.js";
import  {Redis,Amqp}  from '../../global.js';
import smsModel from '../../models/backend/sms.js';



export default class SmsController extends BackendController
{
    #url =  getEnv('BACKEND_URL') + 'sms/';
 
    constructor()
    {
        super();
        this.model = new smsModel();
        this.UsersModel =new UsersModel();   
        this.UserGroupModel =new UserGroupModel();   
    }
    
    async snedUser(req,res){
        try{

            const getAllUsersMobile= await this.UsersModel.getAllUsersMobile();
            const data = {
                "title" : "ارسال پیام به صورت فردی",
                "usersMobile":getAllUsersMobile
            }
            return res.render(this.templatePath+'sms/send_user',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }



    async PostSendUser(req,res){
        try{

            const userMobile=this.safeString(this.input(req.body.mobile));
            const message=this.safeString(this.input(req.body.message));
            const user=await this.UsersModel.getUserByMobile(userMobile);
            const personalizedMessage=replacePlaceholders(message,user);
            const myJsonData = {
                message: personalizedMessage,
                timestamp: new Date(),
                mobile:user.mobile,
                type:"usersMobile"
            };
            await Amqp.sendSms('sms-users',myJsonData);
            const data = {
                "title" : "ارسال پیام به صورت فردی"
            }
            return res.redirect(`${this.#url}/send_user/?msg=ok`);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async snedUserGroup(req,res){
        try{
            const getAllUsersGroup= await this.UserGroupModel.getGroups();
            const data = {
                "title" : "ارسال پیام به صورت گروهی",
                "usersGroup":getAllUsersGroup
            }
            return res.render(this.templatePath+'sms/send_userGroup',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }
    async PostSnedUserGroup(req,res){
        try{
            const userGroup=this.safeString(this.input(req.body.group));
            const content=this.safeString(this.input(req.body.content));
            const users=await this.UsersModel.getAllUserByGroupId(userGroup);
            for (const user of users){
                if(user.mobile){
                    const personalizedMessage=replacePlaceholders(content,user)
                    const myJsonData = {
                        message:  personalizedMessage,
                        timestamp: new Date(),
                        group_id:userGroup,
                        mobile:user.mobile,
                        type:"usersGroup"
                    };
                await Amqp.sendSms('sms-group',myJsonData);   
                }
                else {
                    log(`User ${user.fn} does not have a mobile number.`);
                }     
            }
            const data = {
                "title" : "ارسال پیام به صورت گروهی"
            }
            return res.render(this.templatePath+'sms/send_userGroup',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async getAllUserByFn(req,res){
        try{
            const fn = this.safeString(this.input(req.query.term));
            const data=await this.UsersModel.getAllUserByFn(fn);
            res.json({"data":data})
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }
    async getAllUserByMobile(req,res){
        try{
            const mobile = this.safeString(this.input(req.query.term));
            const data=await this.UsersModel.getAllUserByMobile(mobile);
            res.json({"data":data})
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async getAllUserGroup(req,res){
        try{
            const title = this.safeString(this.input(req.query.term));
            const data=await this.UsersModel.getGroup(title);

            res.json({"data":data})
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }
    #getParams(req){
        try{
            
            const mobile = this.safeString(this.input(req.query.mobile));
            const type = this.safeString(this.input(req.query.type));
            const params = {
                mobile,type
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

    async indexLog(req,res){
        try{
            const sortFields = ['_id','mobile','last_edit_date_time','status'];
            const {page,sort_field,sort_type} = this.handlePagination(req,sortFields);
            const status_id = this.toObjectId(this.input(req.query.status_id),true);
            const status_value = this.toNumber(this.input(req.query.status_value),true);
            const del_id = this.toObjectId(this.input(req.query.del_id),true);
            const {params,params_query} = this.#getParams(req);
            const url = this.#url +'log'+ '?' + params_query;
            const route_url = this.#url;
            const delete_url = url + `&page=${page}`;
            

            const pagination = await this.model.paginationAll(page,sort_field,sort_type,params?.mobile);
            const data = {
                "title" : 'لیست تمامی پیام ها',
                "pagination" : pagination,
                "url" : url,
                "route_url" : route_url,
                "delete_url" : delete_url,
                "sortFields" : sortFields,
                "params" : params,
                "params_query" : params_query,
                "page" : page,
            }
            return res.render(this.templatePath + 'sms/log',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async indexLogOtp(req,res){
        try{
            const sortFields = ['_id','mobile','last_edit_date_time','status'];
            const {page,sort_field,sort_type} = this.handlePagination(req,sortFields);
            const status_id = this.toObjectId(this.input(req.query.status_id),true);
            const status_value = this.toNumber(this.input(req.query.status_value),true);
            const del_id = this.toObjectId(this.input(req.query.del_id),true);
            const {params,params_query} = this.#getParams(req);
            const url = this.#url +'log_otp'+ '?' + params_query;
            const route_url = this.#url;
            const delete_url = url + `&page=${page}`;
            const pagination = await this.model.pagination(page,sort_field,sort_type,params?.mobile,params?.type);
            const data = {
                "title" : 'لیست پیام ها',
                "pagination" : pagination,
                "url" : url,
                "route_url" : route_url,
                "delete_url" : delete_url,
                "sortFields" : sortFields,
                "params" : params,
                "params_query" : params_query,
                "page" : page,
            }
            return res.render(this.templatePath + 'sms/log_otp',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }
    async indexLogBirthdy(req,res){
        try{
            const sortFields = ['_id','user_name','last_edit_date_time','status'];
            const {page,sort_field,sort_type} = this.handlePagination(req,sortFields);
            const status_id = this.toObjectId(this.input(req.query.status_id),true);
            const status_value = this.toNumber(this.input(req.query.status_value),true);
            const del_id = this.toObjectId(this.input(req.query.del_id),true);
            const {params,params_query} = this.#getParams(req);
            const url = this.#url + 'log_birthday'+'?' + params_query;
            const route_url = this.#url;
            const delete_url = url + `&page=${page}`;
           

            const pagination = await this.model.pagination(page,sort_field,sort_type,params?.mobile,params?.type);
            const data = {
                "title" : 'لیست پیام ها',
                "pagination" : pagination,
                "url" : url,
                "route_url" : route_url,
                "delete_url" : delete_url,
                "sortFields" : sortFields,
                "params" : params,
                "params_query" : params_query,
                "page" : page,
            }
            return res.render(this.templatePath + 'sms/log_birthday',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }
    async indexLogGroup(req,res){
        try{
            const sortFields = ['_id','mobile','last_edit_date_time','status'];
            const {page,sort_field,sort_type} = this.handlePagination(req,sortFields);
            const status_id = this.toObjectId(this.input(req.query.status_id),true);
            const status_value = this.toNumber(this.input(req.query.status_value),true);
            const del_id = this.toObjectId(this.input(req.query.del_id),true);
            const {params,params_query} = this.#getParams(req);
            const url = this.#url + 'log_group'+'?' + params_query;
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

            const pagination = await this.model.pagination(page,sort_field,sort_type,params?.mobile,params?.type);
            const data = {
                "title" : 'لیست پیام ها',
                "pagination" : pagination,
                "url" : url,
                "route_url" : route_url,
                "delete_url" : delete_url,
                "sortFields" : sortFields,
                "params" : params,
                "params_query" : params_query,
                "page" : page,
            }
            return res.render(this.templatePath + 'sms/log_group',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }
    async indexLogUsers(req,res){
        try{
            const sortFields = ['_id','mobile','last_edit_date_time','status'];
            const {page,sort_field,sort_type} = this.handlePagination(req,sortFields);
            const status_id = this.toObjectId(this.input(req.query.status_id),true);
            const status_value = this.toNumber(this.input(req.query.status_value),true);
            const del_id = this.toObjectId(this.input(req.query.del_id),true);
            const {params,params_query} = this.#getParams(req);
            const url = this.#url + 'log_users'+'?' + params_query;
            const route_url = this.#url;
            const delete_url = url + `&page=${page}`;
            const pagination = await this.model.pagination(page,sort_field,sort_type,params?.mobile,params?.type);
            const data = {
                "title" : 'لیست تمامی پیام ها',
                "pagination" : pagination,
                "url" : url,
                "route_url" : route_url,
                "delete_url" : delete_url,
                "sortFields" : sortFields,
                "params" : params,
                "params_query" : params_query,
                "page" : page,
            }
            return res.render(this.templatePath + 'sms/log_users',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }









}
