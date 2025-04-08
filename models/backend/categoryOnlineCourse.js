import {MongoDB} from '../../global.js';
import CategoryOnlineCourseSchema from '../../schemas/categoryOnlineCourse.js';
import {log,toObjectId,getEnv} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';

export default class CategoryOnlineCourseModel
{
    constructor(){
        this.model = MongoDB.db.model('category_online_course', CategoryOnlineCourseSchema);
    }

    async add(title,status,title_seo,description_seo,slug,description,logo){
        const last_edit_date_time = datetime.toString();
        const isDupTitle = await this.#checkTitle(title);
        if(isDupTitle > 0)
        {
            return -1;//title is already
        }
        const isDupSlug = await this.#checkSlug(slug);
        if(isDupSlug > 0)
        {
            return -2;//slug is already
        }
        const row = new this.model({
            title,title_seo,description_seo,slug,status,last_edit_date_time,logo,description
        });
        return await row.save();
    }

    async #checkSlug(slug){
        return await this.model.findOne({"slug":slug}).countDocuments();
    }

    async #checkTitle(title){
        return await this.model.findOne({"title":title}).countDocuments();

    }


  

    async getMainCategoryList(){
        return await this.model.find();
    }


    async pagination(page,sortField,sortType,title){
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
        return {
            rows,totalRows,totalPage
        };

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

    async getRow(id){
        return await this.model.findOne({"_id":id});
    }

    async save(id,title,status,title_seo,description_seo,slug,description,logo){
        if(!toObjectId(id))
        {
            return -1;
        }
        const currentRow = await this.getRow(id);
        if(!currentRow)
            return -1;
    
       
        const last_edit_date_time = datetime.toString();
        const data = {
            "status" : status,
            "last_edit_date_time" : last_edit_date_time,
            "title_seo" : title_seo,
            "description_seo" : description_seo,
            "slug" : slug,
            "description" : description,
            "logo" : logo,
        };
        log(data)

        if(currentRow['slug'] !== slug)
        {
            const isDupSlug = await this.#checkSlug(slug);
            if(isDupSlug > 0)
            {
                return -2;//slug is already
            }
            else
            {
                data['slug'] = slug;
            }    
        }


        if(currentRow['title'] !== title)
        {
            const isDup = await this.#checkTitle(title);
            if(isDup > 0)
            {
                return -3;//title is already
            }
            else
            {
                data['title'] = title;
            }    
        }
        
            log(data)

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
        
        else
        {   
            await this.model.deleteOne({"_id":id});
            return 1;

        }
    }

    async removeLogo(id){
        const last_edit_date_time = datetime.toString();
        const data = {
            "logo" : "",
            "last_edit_date_time" : last_edit_date_time,
        };
        
        await this.model.updateOne({"_id":id},{
            "$set" : data 
        });

        return 1;
    }



}



