import {MongoDB} from '../../global.js';
//import BadgeSchema from '../../schemas/badge.js';
import {log,toObjectId,getEnv} from '../../core/utils.js';
import datetime from '../../core/datetime.js';

export default class BadgeModel
{
    constructor(){
        this.model = MongoDB.db.model('badge', BadgeSchema);
    }

    async add(title,icon,score){
       
        const last_edit_date_time = datetime.toString();
        const isDupTitle = await this.#checkTitle(title);
        if(isDupTitle > 0)
        {
            return -1;//title is already
        }
        const isDupScore = await this.#checkScore(score);
        if(isDupScore > 0)
        {
            return -2;//title is already
        }
        const row = new this.model({
            title,icon,score,last_edit_date_time
        });
        return await row.save();
    }


    async #checkTitle(title){
        return await this.model.findOne({
            "title":{$regex: title, "$options": "i"}
        }).countDocuments();
    }

    async #checkScore(score){
        return await this.model.findOne({
            "score":score
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

    async save(id,title,icon,score){
        if(!toObjectId(id))
        {
            return 0;
        }
        const currentRow = await this.getRow(id);
        if(!currentRow)
            return 0;
    
        const last_edit_date_time = datetime.toString();
        const data = {
            "icon" : icon,
            "last_edit_date_time" : last_edit_date_time,
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

        if(currentRow['score'] !== score)
        {
            const isDup = await this.#checkScore(score);
            if(isDup > 0)
            {
                return -2;//score is already
            }
            else
            {
                data['score'] = score;
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


}



