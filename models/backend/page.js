import {MongoDB} from '../../global.js';
import PageSchema from '../../schemas/page.js';
import {log,toObjectId,getEnv} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';

export default class PageModel
{
    constructor(){
        this.model = MongoDB.db.model('page', PageSchema);
    }

    async pagination(){
        return await this.model.find();
    }

    async getRow(id){
        return await this.model.findOne({"_id":id});
    }

    async save(id,title_seo,description_seo,content){
        if(!toObjectId(id))
        {
            return 0;
        }
        const currentRow = await this.getRow(id);
        if(!currentRow)
            return 0;
    
        const last_edit_date_time = datetime.toString();
        const data = {
            "last_edit_date_time" : last_edit_date_time,
            "title_seo" : title_seo,
            "description_seo" : description_seo,
            "content" : content,
        };



        const result = await this.model.updateOne({"_id":id},{
            "$set" : data 
        });

        
        if(result?.modifiedCount > 0)
            return 1;
        else
            return 0;

    }


}



