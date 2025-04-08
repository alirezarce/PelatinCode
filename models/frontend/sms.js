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



    async add(title,data){
        const last_send_date_time = datetime.toString();
        const mobile =data.mobile;
        const status =data.status;
        const row = new this.model({
            title,last_send_date_time
        });
        const result = await row.save();
        console.log('result save sms log:'+result)
        
    }

   




}



 