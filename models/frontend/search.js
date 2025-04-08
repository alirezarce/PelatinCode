
import {MongoDB} from '../../global.js';
//import ChallengeSchema from '../../schemas/challenge.js';
//import LevelSchema from '../../schemas/level.js';
//import CategoryUserSchema from '../../schemas/categoryUser.js';
//import FlagChallengeSchema from '../../schemas/flagChallenge.js';
import {log,toObjectId,getEnv} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';

export default class SearchModel
{
    constructor(){
        //this.model = MongoDB.db.model('challenge',ChallengeSchema);
    }


    async pagination(name,tag,page = 1){
        const where = {
            "status" : 1
        };
        if(name != '')
        {
            where['name'] = {$regex: '.*' + name + '.*', "$options": "i"};
        }
        if(tag != '')
        {
            where['tag'] = {$regex: '.*' + tag + '.*', "$options": "i"};
        }
        const ROWS_PRE_PAGE = 12;
        const skip = Math.abs(ROWS_PRE_PAGE * page - ROWS_PRE_PAGE);
        const totalRows = await this.model.findOne(where).countDocuments();
        const totalPage = Math.ceil(totalRows / ROWS_PRE_PAGE);
        const rows =  await this.model.find(where)
            .populate('level_id')
            .populate('category_id')
            .populate('sub_category_id')
            .sort([['_id',-1]])
        .skip(skip)
        .limit(ROWS_PRE_PAGE);   
         return {
            rows,totalRows,totalPage
        };
    }




    
    async getCountChallenge(category_id,sub_category_id){
        return await this.model.findOne({"category_id":category_id
            ,"sub_category_id":sub_category_id,"status":true}).countDocuments();
    }

 


}



