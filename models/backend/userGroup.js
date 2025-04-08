import {MongoDB} from '../../global.js';
import UserGroupSchema from '../../schemas/userGroup.js';
import {log,toObjectId,getEnv} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';

export default class CategoryUserModel
{
    constructor(){
        this.model = MongoDB.db.model('user_group', UserGroupSchema);
    }

    async add(title,status,description){
        const last_edit_date_time = datetime.toString();
        const isDupTitle = await this.#checkTitle(title);
        if(isDupTitle > 0)
        {
            return -1;//title is already
        }
        const row = new this.model({
            title,status,last_edit_date_time,description
        });
        return await row.save();
    }

    

    async #checkTitle(title){
        return await this.model.findOne(
            {
                "title":title
            }
        ).countDocuments();
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

    async save(id,title,status,description,){
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
            "description" : description,
        };

        


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


    async getGroups(){
        return await this.model.find();
    }



}



