import {MongoDB} from '../../global.js';
import SmsSchema from './../../schemas/sms.js';
import {log,toObjectId,getEnv} from './../../core/utils.js';
import datetime from './../../core/datetime.js';
import crypto from './../../core/crypto.js';

export default class SmsModel
{
    constructor(){
    this.model = MongoDB.db.model('sms', SmsSchema);
    }



    async add(title){
        const last_send_date_time = datetime.toString();
      
        const row = new this.model({
            title,last_send_date_time
        });
        const result = await row.save();
        console.log('result save sms log:'+result)
        
    }
    

   


    async paginationAll(page,sortField,sortType,title){
        const where = {};

        if(title !== '')
        {
            where['title'] = {$regex: '.*' + title + '.*', "$options": "i"};
        }

        const ROWS_PRE_PAGE = getEnv('ROWS_PRE_PAGE','number');
        const skip = Math.abs(ROWS_PRE_PAGE * page - ROWS_PRE_PAGE);
        const totalRows = await this.model.findOne(where).countDocuments();
        const totalPage = Math.ceil(totalRows / ROWS_PRE_PAGE);
        const rows =  await this.model.find(where).sort([[sortField,sortType]])
        .skip(skip)
        .limit(ROWS_PRE_PAGE);   
        console.log(rows)
        return {
            rows,totalRows,totalPage
        };

    }

    async updateContentBirth (contentـbirth){
        const last_send_date_time = datetime.toString();
      
        const row = new this.model({
            contentـbirth,last_send_date_time
        });
        const result = await row.save();
    }
    async getBirhtTxt (){
        return this.model.find().select({"contentـbirth":1})
    }

    async pagination(page,sortField,sortType,title,type){
        const where = {};
        if(type !== '')
            {
                where['type'] = type;
            }
           
        if(title !== '')
        {
            where['title'] = {$regex: '.*' + title + '.*', "$options": "i"};
        }
        log(where)

        const ROWS_PRE_PAGE = getEnv('ROWS_PRE_PAGE','number');
        const skip = Math.abs(ROWS_PRE_PAGE * page - ROWS_PRE_PAGE);
        const totalRows = await this.model.findOne(where).countDocuments();
        const totalPage = Math.ceil(totalRows / ROWS_PRE_PAGE);
        const rows =  await this.model.find(where).sort([[sortField,sortType]])
        .skip(skip)
        .limit(ROWS_PRE_PAGE);   
        return {
            rows,totalRows,totalPage
        };

    }


 


}



 