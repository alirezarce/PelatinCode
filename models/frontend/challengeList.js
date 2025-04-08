
import {MongoDB} from '../../global.js';
//import ChallengeSchema from '../../schemas/challenge.js';
//import LevelSchema from '../../schemas/level.js';
//import CategoryUserSchema from '../../schemas/categoryUser.js';
//import FlagChallengeSchema from '../../schemas/flagChallenge.js';
import {log,toObjectId,getEnv} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';
//import SubmitFlagSchema from '../../schemas/submit-flag.js';

export default class ChallengeListModel
{
    constructor(){
        //this.model = MongoDB.db.model('challenge',ChallengeSchema);
        //this.LevelsModel = MongoDB.db.model('level', LevelSchema);
        //this.CategoryUserModel = MongoDB.db.model('category_user', CategoryUserSchema);
        //this.FlagChallengeModel = MongoDB.db.model('flag_challenge', FlagChallengeSchema);
        //this.SubmitFlag = MongoDB.db.model('submit_flag', SubmitFlagSchema);
    }


    async pagination(category_id = null,sub_category_id = null ,page){
        const where = {
            "status" : true
        };
        if(category_id)
        {
            where['category_id'] = category_id;
        }
        if(sub_category_id)
        {
            where['sub_category_id'] = sub_category_id
        }
        const ROWS_PRE_PAGE = 6;
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


    async getCategory(slug){
        return await this.CategoryChallengeModel.findOne({"slug":slug,"status":true});
    }

    async getSubCategory(id){
        return await this.CategoryChallengeModel.findOne({"_id":id,"status":true});
    }


    
    async getCountChallenge(category_id,sub_category_id){
        return await this.model.findOne({"category_id":category_id
            ,"sub_category_id":sub_category_id,"status":true}).countDocuments();
    }

    async getChallengeIsDone(user_id,challenge_id){
        const totalFlag = await this.FlagChallengeModel.find({"challenge_id":challenge_id,"status":true}).countDocuments();
        const totalPass = await this.SubmitFlag.find({"user_id":user_id,"challenge_id":challenge_id}).countDocuments();
        if(totalFlag == totalPass)
            return 1;
        else
            return 0;
    }


 


}



