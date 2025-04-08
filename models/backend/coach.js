
import {MongoDB} from '../../global.js';
import CoachSchema from '../../schemas/coach.js';

import {log,toObjectId,getEnv} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';

export default class BlogModel
{
    constructor(){
        this.model = MongoDB.db.model('coach',CoachSchema);


    }

    async add(name,sex,status,short_description
        ,long_description,img,big_img,medium_img,slug,title_seo,description_seo){
        const last_edit_date_time = datetime.toString();
        const isDupName = await this.#checkName(name);
        if(isDupName > 0)
        {
            return -1;//title is already
        }
        const isDupSlug = await this.#checkSlug(slug);
        if(isDupSlug > 0)
        {
            return -3;//slug is already
        }
        const row = new this.model({
            name,sex,status
            ,short_description,long_description,img,big_img,medium_img,slug,title_seo,description_seo
            ,last_edit_date_time
        });
        return await row.save();
    }

    async #checkSlug(slug){
        return await this.model.findOne({"slug":slug}).countDocuments();
    }


    async #checkName(name){
        return await this.model.findOne(
            {
                "name":{$regex: name, "$options": "i"}
            }
        ).countDocuments();
    }


    async pagination(page,sortField,sortType,name=''){
        const where = {};

        if(name !== '')
        {
            where['name'] = {$regex: '.*' + name + '.*', "$options": "i"};
        }
        const ROWS_PRE_PAGE = getEnv('ROWS_PRE_PAGE','number');
        const skip = Math.abs(ROWS_PRE_PAGE * page - ROWS_PRE_PAGE);
        const totalRows = await this.model.findOne(where).countDocuments();
        const totalPage = Math.ceil(totalRows / ROWS_PRE_PAGE);
        const rows =  await this.model.find(where)
        .sort([[sortField,sortType]])
        .skip(skip)
        .limit(ROWS_PRE_PAGE);   
         return {
            rows,totalRows,totalPage
        };
    }


    async getRow(id){
        return await this.model.findOne({"_id":id});
    }
    
    async save(id,name,sex,status
        ,short_description,long_description,img,big_img,medium_img,slug,title_seo,description_seo){
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
            "sex" : sex,
            "status" : status,
            "short_description" : short_description,
            "long_description" : long_description,
            "img" : img,
            "big_img": big_img,
            "medium_img": medium_img,
            "title_seo" : title_seo,
            "description_seo" : description_seo,
            
        };    

        if(currentRow['name'] !== name)
        {
            const isDup = await this.#checkName(name);
            if(isDup > 0)
            {
                return -1;//name is already
            }
            else
            {
                data['name'] = name;
            }    
        }

        if(currentRow['slug'] !== slug)
        {
            const isDup3 = await this.#checkSlug(slug);
            if(isDup3 > 0)
            {
                return -3;//slug is already
            }
            else
            {
                data['slug'] = slug;
            }    
        }

        const result = await this.model.updateOne({"_id":id},{
            "$set" : data 
        });

        
        if(result?.modifiedCount > 0)
            return 1;
        else
            return 0;

    }

    async deleteRow(id){
        if(!toObjectId(id))
        {
            return 0;
        }
        const currentRow = await this.getRow(id);
        if(!currentRow)
            return 0;
        
        await this.model.deleteOne({"_id":id});
        return 1;

    }

    async changeStatus(status_id,status_value){
        const last_edit_date_time = datetime.toString();
        const data = {
            "status" : status_value,
            "last_edit_date_time" : last_edit_date_time,
        };
        
        await this.model.updateOne({"_id":status_id},{
            "$set" : data 
        });

        return 1;
    }




    async deleteImg(id)
    {
        const data = {
            "img" : "",
            "last_edit_date_time" : datetime.toString()
        };

        await this.model.updateOne({"_id":id},{
            "$set" : data
        });

        return 1;
    }

    async deleteBigImg(id)
    {
        const data = {
            "big_img" : "",
            "last_edit_date_time" : datetime.toString()
        };

        await this.model.updateOne({"_id":id},{
            "$set" : data
        });

        return 1;
    }

    async deleteMediumImg(id)
    {
        const data = {
            "medium_img" : "",
            "last_edit_date_time" : datetime.toString()
        };

        await this.model.updateOne({"_id":id},{
            "$set" : data
        });

        return 1;
    }


    
}



