
import {MongoDB} from '../../global.js';
import FaceToFaceCourseSchema from '../../schemas/faceTofaceCourse.js';
import UserGroupSchema from '../../schemas/userGroup.js';
import CategoryFaceToFaceCourseSchema from '../../schemas/categoryFaceToFaceCourse.js';

import {log,toObjectId,getEnv} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';

export default class BlogModel
{
    constructor(){
        this.model = MongoDB.db.model('facetoface_course',FaceToFaceCourseSchema);
        this.CategoryFaceToFaceCourseModel = MongoDB.db.model('category_facetoface_course',CategoryFaceToFaceCourseSchema);

    }

    async add(title,category_id,status
        ,short_description,long_description,price,img,medium_img,slug,title_seo
        ,description_seo){
        const last_edit_date_time = datetime.toString();
        const isDupName = await this.#checkTitle(title);
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
            title,category_id,status
            ,short_description,long_description,price,img,medium_img,slug,title_seo,description_seo
            ,last_edit_date_time
        });
        return await row.save();
    }

    async #checkSlug(slug){
        return await this.model.findOne({"slug":slug}).countDocuments();
    }


    async #checkTitle(title){
        return await this.model.findOne(
            {
                "title":{$regex: title, "$options": "i"}
            }
        ).countDocuments();
    }


    async pagination(page,sortField,sortType,title=''){
        const where = {};

        if(title !== '')
        {
            where['title'] = {$regex: '.*' + title + '.*', "$options": "i"};
        }
        const ROWS_PRE_PAGE = getEnv('ROWS_PRE_PAGE','number');
        const skip = Math.abs(ROWS_PRE_PAGE * page - ROWS_PRE_PAGE);
        const totalRows = await this.model.findOne(where).countDocuments();
        const totalPage = Math.ceil(totalRows / ROWS_PRE_PAGE);
        const rows =  await this.model.find(where)
            .populate('category_id')
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
    
    async save(id,title,category_id,status
        ,short_description,long_description,price,img,medium_img,slug,title_seo,description_seo){
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
            "category_id" : category_id,
            "status" : status,
            "short_description" : short_description,
            "long_description" : long_description,
            "price" : price,
            "img" : img,
            "medium_img":medium_img,
            "title_seo" : title_seo,
            "description_seo" : description_seo,
            
        };    

        if(currentRow['title'] !== title)
        {
            const isDup = await this.#checkTitle(title);
            if(isDup > 0)
            {
                return -1;//title is already
            }
            else
            {
                data['title'] = title;
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


    async getCategories(){
        return await this.CategoryFaceToFaceCourseModel.find().select({"_id":1,"title":1});
    }

   

    async deleteImg(course_id)
    {
        const data = {
            "img" : "",
            "last_edit_date_time" : datetime.toString()
        };

        await this.model.updateOne({"_id":course_id},{
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



