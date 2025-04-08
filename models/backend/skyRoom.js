import {MongoDB} from '../../global.js';
import SkyRoomSchema from '../../schemas/skyRoom.js';
import {log,toObjectId,getEnv} from '../../core/utils.js';
import datetime from '../../core/datetime.js';

export default class LevelModel
{
    constructor(){
        this.model = MongoDB.db.model('sky_room', SkyRoomSchema);
    }

    async add(user_name,password,status){
       
        const last_edit_date_time = datetime.toString();
        const isDup = await this.#checkUser(user_name);
        if(isDup > 0)
        {
            return -1;//title is already
        }
       
        const row = new this.model({
            user_name,password,status,last_edit_date_time
        });
        return await row.save();
    }


    async #checkUser(user_name){
        return await this.model.findOne({
            "user_name":{$regex: user_name, "$options": "i"}
        }).countDocuments();
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

    async save(id,user_name,password,status){
        if(!toObjectId(id))
        {
            return 0;
        }
        const currentRow = await this.getRow(id);
        if(!currentRow)
            return 0;
    
        const last_edit_date_time = datetime.toString();
        const data = {
            "status" : status,
            "password":password,
            "last_edit_date_time" : last_edit_date_time,
        };


        if(currentRow['user_name'] !== user_name)
        {
            const isDup = await this.#checkUser(user_name);
            if(isDup > 0)
            {
                return -2;//title is already
            }
            else
            {
                data['user_name'] = user_name;
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

}



