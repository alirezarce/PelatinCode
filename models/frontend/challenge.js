
import {MongoDB} from '../../global.js';
//import ChallengeSchema from '../../schemas/challenge.js';
//import LevelSchema from '../../schemas/level.js';
//import CategoryUserSchema from '../../schemas/categoryUser.js';
//import FlagChallengeSchema from '../../schemas/flagChallenge.js';
//import SubmitFlagSchema from '../../schemas/submit-flag.js';
import {log,toObjectId,getEnv} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';

export default class ChallengeModel
{
    constructor(){
        //this.model = MongoDB.db.model('challenge',ChallengeSchema);
        //this.LevelsModel = MongoDB.db.model('level', LevelSchema);
       //this.CategoryUserModel = MongoDB.db.model('category_user', CategoryUserSchema);
        //this.FlagChallengeModel = MongoDB.db.model('flag_challenge', FlagChallengeSchema);
        //this.SubmitFlag = MongoDB.db.model('submit_flag', SubmitFlagSchema);
    }



    async getCategory(id){
        return await this.CategoryChallengeModel.findOne({"_id":id,"status":true});
    }

    async getSubCategory(id){
        return await this.CategoryChallengeModel.findOne({"_id":id,"status":true});
    }

    async getChallenge(slug){
        return await this.model.findOne({"slug":slug,"status":true})
        .populate('level_id')
        .populate('category_id')
        .populate('sub_category_id');
    }

    async getCountChallenge(category_id,sub_category_id){
        return await this.model.findOne({"category_id":category_id
            ,"sub_category_id":sub_category_id,"status":true}).countDocuments();
    }

    async getFlagList(challenge_id){
        return await this.FlagChallengeModel.find({"challenge_id":challenge_id,"status":1})
    }

    async getChallengeById(id){
        return await this.model.findOne({"_id":id,"status":true})
        .populate('level_id')
        .populate('category_id')
        .populate('sub_category_id');
    }

    async getFlagById(id,challenge_id){
        return await this.FlagChallengeModel.findOne({"_id":id,"status":true,"challenge_id":challenge_id})
    }

    async getSubmitFlag(user_id,flag_id,challenge_id){
        return await this.SubmitFlag.findOne({"user_id":user_id,"flag_id":flag_id,"challenge_id":challenge_id})
    }


    async submitFlag(user_id,flag_id,challenge_id,flag,score){
        const check = await this.getSubmitFlag(user_id,flag_id,challenge_id);
        if(check)
        {
            return -1;
        }
        const submit_date_time = datetime.toString();
        const row = new this.SubmitFlag({
            submit_date_time,user_id,flag_id,challenge_id,flag,score
        });
        const result = await row.save();
        if(result)
        {
            return 1;
        }
        else
        {
            return 0;
        }
    }


    async getProgressChallengeValue(user_id,challenge_id){
        const totalFlag = await this.FlagChallengeModel.find({"challenge_id":challenge_id,"status":true}).countDocuments();
        const totalPass = await this.SubmitFlag.find({"user_id":user_id,"challenge_id":challenge_id}).countDocuments();
        const p = 100 / totalFlag;
        return parseInt(totalPass * p);
    }


}



