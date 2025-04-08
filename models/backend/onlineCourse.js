
import {MongoDB} from '../../global.js';
import OnlineCourseSchema from '../../schemas/onlineCourse.js';
import VideOnlineCourseSchema from '../../schemas/videoOnlineCourse.js';

import {log,toObjectId,getEnv} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';
import CategoryOnlineCourseSchema from '../../schemas/categoryOnlineCourse.js';

export default class OnlineCourseModel
{
    constructor(){
        this.model = MongoDB.db.model('online_course',OnlineCourseSchema);
        this.CategoryOnlineCourseModel = MongoDB.db.model('category_online_course', CategoryOnlineCourseSchema);
        this.VideoOnlineCourseModel = MongoDB.db.model('video_online_course', VideOnlineCourseSchema);
    }

    async add(title,category_id,status_price,price,status
        ,short_description,long_description,img,medium_img,img_video1,link_video1,img_video2,link_video2
        ,img_video3,link_video3,slug,title_seo,description_seo){
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
            title,category_id,status_price,price,status
                ,short_description,long_description,img,medium_img,img_video1,link_video1,img_video2,link_video2
                ,img_video3,link_video3,slug,title_seo,description_seo
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
        const rows =  await this.model.find(where).populate('category_id')
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
    async getRowVideo(id){
        return await this.VideoOnlineCourseModel.findOne({"_id":id});
    }
    
    async save(id,title,category_id,status_price,price,status
        ,short_description,long_description,img,medium_img,img_video1,link_video1,img_video2,link_video2
        ,img_video3,link_video3,slug,title_seo,description_seo){
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
            "title" : title,
            "category_id":category_id,
            "status_price" : status_price,
            "price":price,
            "short_description" : short_description,
            "long_description" : long_description,
            "img" : img,
            "medium_img":medium_img,
            "img_video1":img_video1,
            "link_video1":link_video1,
            "img_video2":img_video2,
            "link_video2":link_video2,
            "img_video3":img_video3,
            "link_video3":link_video3,
            "slug":slug,
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

    async saveSkyRoomId(id,skyRoom_id){
        if(!toObjectId(id))
        {
            return 0;
        }
        const currentRow = await this.getRow(id);
        if(!currentRow)
            return 0;
    
        const data = {
        "skyRoom_id":skyRoom_id 
        };    

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
    async #checkVideo(title,course_id){
        return await this.VideoOnlineCourseModel.findOne(
            {
                
                "title":title,"course_id":course_id
            }
        ).countDocuments();
    }



    async addVideo(course_id,title,link,img,status){
        const last_edit_date_time = datetime.toString();

        const isDupVideo = await this.#checkVideo(title,course_id);
        if(isDupVideo > 0)
        {
            return -1;//video is already
        }
        const row = new this.VideoOnlineCourseModel({
            course_id,
            title,
            link,
            img,
            status,
            last_edit_date_time
        });

        
        log(img)
        log('row'+row)
        
        return await row.save();
    }
    async saveVideo(id,title,link,img,status){
        if(!toObjectId(id)){
            return 0;
        }
        const currentRow = await this.getVideoById(id);
        if(!currentRow)
            return 0;
    
        const last_edit_date_time = datetime.toString();
        const data = {
            "title":title,
            "link":link,
            "img":img,
            "status" : status,
            "last_edit_date_time" : last_edit_date_time,
        };    
        log(data)

        if(currentRow['title'] !== title)
        {
            const isDup = await this.#checkVideo(title,id);
            if(isDup > 0)
            {
                return -1;//title is already
            }
            else
            {
                data['title'] = title;
            }    
        }



        const result = await this.VideoOnlineCourseModel.updateOne({"_id":id},{
            "$set" : data 
        });    
        if(result?.modifiedCount > 0)
            return 1;
        else
            return 0;


    }

    async getVideoList(id){
         return await this.VideoOnlineCourseModel.find({"course_id":id});
    }


    async getVideoById(id){
        return await this.VideoOnlineCourseModel.findOne({"_id":id});
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

    async deleteImgVideo1(course_id)
    {
        const data = {
            "img_video1" : "",
            "last_edit_date_time" : datetime.toString()
        };

        await this.model.updateOne({"_id":course_id},{
            "$set" : data
        });

        return 1;
    }
    async deleteImgVideo2(course_id)
    {
        const data = {
            "img_video2" : "",
            "last_edit_date_time" : datetime.toString()
        };

        await this.model.updateOne({"_id":course_id},{
            "$set" : data
        });

        return 1;
    }
    async deleteImgVideo3(course_id)
    {
        const data = {
            "img_video3" : "",
            "last_edit_date_time" : datetime.toString()
        };

        await this.model.updateOne({"_id":course_id},{
            "$set" : data
        });

        return 1;
    }
    async deleteImgVideoCourse(id)
    {
        const data = {
            "img" : "",
            "last_edit_date_time" : datetime.toString()
        };

        await this.VideoOnlineCourseModel.updateOne({"_id":id},{
            "$set" : data
        });

        return 1;
    }

    async changeStatusVideo(status_id,status_value){
        const last_edit_date_time = datetime.toString();
        const data = {
            "status" : status_value,
            "last_edit_date_time" : last_edit_date_time,
        };
        
        await this.VideoOnlineCourseModel.updateOne({"_id":status_id},{
            "$set" : data 
        });

        return 1;
    }

    async deleteRowVideo(id){
        if(!toObjectId(id))
        {
            return 0;
        }
        const currentRow = await this.getRowVideo(id);
        if(!currentRow)
            return 0;
        
        await this.VideoOnlineCourseModel.deleteOne({"_id":id});
        return 1;

    }

    async getCategories(){
        return await this.CategoryOnlineCourseModel.find().select({"_id":1,"title":1});
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



