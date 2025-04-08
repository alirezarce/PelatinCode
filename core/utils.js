import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
const env = dotenv.config();
dotenvExpand.expand(env);
import mongoose from 'mongoose';
import process from 'process';
import datetime from "./datetime.js";
import crypto from "./crypto.js";
import nunjucks from 'nunjucks';
import { Redis,Amqp } from './../global.js';

import  Kavenegar from  'kavenegar';
import exp from 'constants';

/*
    string -> default
    number
    bool
*/
export function getEnv(key,cast='string')
{
    let ret = '';
    switch(cast)
    {
        case 'number':
            ret = toNumber(process.env[key]);
        break;
        case 'bool':
            ret = (process.env[key] === 'true') ? true : false;
        break;
        default:
            ret = process.env[key];
        break;
    }
    return ret ?? '';
}

export function log(obj)
{
    console.log(obj);
}

export function toNumber(str){
    try{
        const ret = Number(str);
        return isNaN(ret) ? 0 : ret;
    }
    catch(e){
        return 0;
    }
}


export function sleep(ms)
{
    return new Promise((resolve,reject) => {
        setTimeout(()=> {
            resolve(true);
        },ms);
    });
}

export function random(min,max)
{
    try{
        return Math.floor(
            Math.random() * (max - min + 1) + min
        );        
    }
    catch(e){
        return 0;
    }
}

export function stringify(obj)
{
    try{
        return JSON.stringify(obj);
    }
    catch(e){
        return '';
    }
}

export function toJSON(str)
{
    try{
        return JSON.parse(str);
    }
    catch(e){
        return {};
    }
}

export function isJSON(str) 
{
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


export function toObjectId(str,toString = false){
    try{
        if(mongoose.Types.ObjectId.isValid(str))
            return toString ? mongoose.Types.ObjectId(str) + '' : mongoose.Types.ObjectId(str);
        else
            return '';
    }
    catch(e){
        return '';
    }
}


export function getPath()
{
    return process.cwd()+'/';
}

export function csrfToken(req)
{
    try{
        const token = crypto.hash(datetime.getTimeStamp() + random(1000000000000,9999999999999));
        req.session.csrf_token = token;
        return nunjucks.runtime.markSafe(`<input type="hidden" name="csrf_token" value="${token}">`);    
    }
    catch(e){
        return '';
    }
}


export function renderID(req,totalRows)
{
    try{
        let page = req.query?.page ?? 1;
        page = toNumber(page);
        if(page <= 0)
            page = 1;
        if(req.session?.sort_type === 'asc')
        {
            let n = getEnv('ROWS_PRE_PAGE','number') * page - getEnv('ROWS_PRE_PAGE','number');
            return {
                "opt" : "+",
                "n" : n
            };
        }
        else
        {

            let n = totalRows - (getEnv('ROWS_PRE_PAGE','number') * page) + getEnv('ROWS_PRE_PAGE','number') + 1;
            return {
                "opt" : "-",
                "n" : n
            };
        }
    }
    catch(e){
        return e.toString();
    }
}


export function generateRandomNumber  (min,max) {
    try {
        return Math.floor(Math.random() * (max - min)) + min;      
    } catch (e) {
        return Math.random();
    }
};

export  function generateOtp (mobile,password) {
    try {
       
        const otp  = generateRandomNumber(100000,999999);
        Redis.setHash(getEnv('REDIS_REGISTER_OTP')+mobile, {"mobile": mobile,"password":password,"otp": otp},getEnv('REDIS_RESET_OTP_EXPIRE'));
        return otp;
    }
    catch (e) {
        return e.toString();
    }
};

export  function generateOtpResetPassword(mobile,password) {
    try {
        const otp  = generateRandomNumber(100000,999999);
        Redis.setHash(getEnv('REDIS_RESETPASS_OTP')+mobile, {"mobile": mobile,"password":password,"otp": otp},getEnv('REDIS_RESET_OTP_EXPIRE'));
        return otp;
    }
    catch (e) {
        return e.toString();
    }
};

export function checkPasswordStrength (password) {
    
        if(password.length < 6 )
            return false;
        
        if(!new RegExp('[A-Z]').test(password))
            return false;
            
        if(!new RegExp('[a-z]').test(password))
            return false;
    
        if(!new RegExp('[0-9]').test(password))
            return false;
    
        if(!new RegExp(/[`~!@#$%^&*()_|+\-=?;:' ",.<>\{\}\[\]\\\/]/).test(password))
            return false;
        
        return true;
    
}

export function hasKey  (obj,key) {
    try{
        return obj.hasOwnProperty(key);
    }
    catch(e)
    {
        return false;
    }
};

export function number_format(number, decimals, dec_point, thousands_point) {

    if (number == null || !isFinite(number)) {
        return '';
    }

    if (!decimals) {
        var len = number.toString().split('.').length;
        decimals = len > 1 ? len : 0;
    }

    if (!dec_point) {
        dec_point = '.';
    }

    if (!thousands_point) {
        thousands_point = ',';
    }

    number = parseFloat(number).toFixed(decimals);

    number = number.replace(".", dec_point);

    var splitNum = number.split(dec_point);
    splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_point);
    number = splitNum.join(dec_point);

    return number;
}

export function replacePlaceholders(template, user) {
  return template
    .replace(/%firstname%/g, user.fn || '')
    .replace(/%lastname%/g, user.ln || '')
    .replace(/%mobile%/g, user.mobile || '');
}



