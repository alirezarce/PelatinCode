import {MongoDB} from '../../global.js';
import SettingsSchema from '../../schemas/settings.js';
import SliderSchema from '../../schemas/slider.js';
import {log,toObjectId,getEnv} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';

export default class PageModel
{
    constructor(){
        this.model = MongoDB.db.model('settings', SettingsSchema);
        this.SliderModel =MongoDB.db.model('slider', SliderSchema);
    }

    async pagination(){
        return await this.model.find();
    }
    async paginationSlider(){
        return await this.SliderModel.find();
    }
    async getRowSettings(id){
        return await this.model.findOne({"_id":id});
    }


    async getSliders(){
        return await this.SliderModel.find();
    }
    async getRowSlider(id){
        return await this.SliderModel.findOne({"_id":id});
    }

    async saveSlider(id,title,content,link,img){
        if(!toObjectId(id))
        {
            return 0;
        }
        const currentRow = await this.getRowSlider(id);
        if(!currentRow)
            return 0;
    
        const last_edit_date_time = datetime.toString();
        const data = {
            "last_edit_date_time" : last_edit_date_time,
            "title":title,
            "content" : content,
            "link":link,
            "img":img
        };

        const result = await this.SliderModel.updateOne({"_id":id},{
            "$set" : data 
        });
        
        if(result?.modifiedCount > 0)
            return 1;
        else
            return 0;

    }

    async saveSettings(id,title_seo,description_seo,content){
        if(!toObjectId(id))
        {
            return 0;
        }
        const currentRow = await this.getRowSettings(id);
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


    async deleteImg(id)
    {
        const data = {
            "img" : "",
            "last_edit_date_time" : datetime.toString()
        };

        await this.SliderModel.updateOne({"_id":id},{
            "$set" : data
        });

        return 1;
    }


}



