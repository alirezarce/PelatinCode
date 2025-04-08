import {MongoDB} from '../../global.js';
import {log,toObjectId} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import categoryBlogSchema from '../../schemas/categoryBlog.js';
import settingsSchema from '../../schemas/settings.js';
import offlineCourseSchema from '../../schemas/categoryOfflineCourse.js';
import onlineCourseSchema from '../../schemas/categoryOnlineCourse.js';
import categoryFaceToFaceCourseSchema from '../../schemas/categoryFaceToFaceCourse.js';
import coachSchema from '../../schemas/coach.js';
import UserSchema from './../../schemas/user.js';


//import onlineCourseSchema from '../../schemas/categoryOfflineCourse.js';
//import ChallengeSchema from '../../schemas/challenge.js';
//import SubmitFlagSchema from './../../schemas/submit-flag.js';
//import BadgeSchema from './../../schemas/badge.js';

export default class GlobalModel
{
    constructor(){
        this.categoryBlogModel = MongoDB.db.model('category_blog', categoryBlogSchema);
        this.settingsModel=MongoDB.db.model('settings', settingsSchema);
        this.categoryOfflineModel = MongoDB.db.model('category_offline_course',offlineCourseSchema);
        this.categoryOnlineModel = MongoDB.db.model('category_online_course',onlineCourseSchema);
        this.categoryFaceToFaceModel = MongoDB.db.model('category_facetoface_course', categoryFaceToFaceCourseSchema);
        this.coachModel = MongoDB.db.model('coach', coachSchema);
        this.UserModel = MongoDB.db.model('user', UserSchema);

        
    }

    async getCategoryBlogListAll(){
        return await this.categoryBlogModel.find({"status":true});
    }
    async getCategoryOffileCoursListAll(){
        return await this.categoryOfflineModel.find({"status":true});
    }

    async getCategoryOnlineCoursListAll(){
        return await this.categoryOnlineModel.find({"status":true});
    }

    async getCategoryFaceToFaceCoursListAll(){
        return await this.categoryFaceToFaceModel.find({"status":true});
    }
    async getManCoachListAll(){
        return await this.coachModel.find({"status":true,"sex":1});
    }
    async getWomanCoachListAll(){
        return await this.coachModel.find({"status":true,"sex":0});
    }

    async getSettings(){
        return await this.settingsModel.find({});
    }
    async getCountAllUser(){
        return await this.UserModel.find({"is_verify":true}).countDocuments();
    }


    async getCountAllchallenge(){
        return await this.ChallengeModel.find({"status":true}).countDocuments();
    }

    async getCountAllUser(){
        return await this.UserModel.find({"is_verify":true}).countDocuments();
    }

    async getHallOfFame(){
        return await this.SubmitFlag.aggregate(
            [
                { 
                    $lookup: {from: 'users', localField: 'user_id', foreignField: '_id', as: 'users'} 
                },
                {
                 "$unwind": "$users"
                },
                { 
                    $lookup: {from: 'challenges', localField: 'challenge_id', foreignField: '_id', as: 'challenges'} 
                },
                {
                 "$unwind": "$challenges"
                },
               
                  { $lookup: {
                    from: "category_challenges",
                    let: {
                      category_id: "$challenges.category_id"
                    },
                    pipeline: [
                      { $match: {
                          $expr: { 
                                   $eq: [ "$_id", "$$category_id" ] 
                              }
                           
                      } },
                    ],
                    as: "category_challenges"
                  } },
                {
                 "$unwind": "$category_challenges"
                },
                
               {
                  "$project": {
                    "username" : "$users.username",
                    "user_id" : "$users._id",
                    "score" : "$score",
                    "type_team" :"$category_challenges.type_team"
                  }
                },
                
                   {
                    $group : 
                    {
                        _id: "$user_id",
                         red: { $sum: { $cond: [ { $eq: [ "$type_team", 0 ] }, "$score", 0 ] } },
                         blue: { $sum: { $cond: [ { $eq: [ "$type_team", 1 ] }, "$score", 0 ] } },
                         
                         username : { $first: '$username' },
                    }
                },
                {
                  "$project": {
                    score : { $add : [ "$red","$blue" ] },
                     "username" : 1,
                    "user_id" : 1,
                    "red" : 1,
                    "blue" : 1,
                  }
                },                
                
                {
                    $sort : {
                        score : -1
                    }
                },
                {
                    $limit : 10
                }
                
          ]
          
        );
    }


    async getBadge(score){
        return await this.Badge.find({"score":{ $lte : score}}).sort([['score',-1]]).limit(1);
    }


    async userUp100ScoreHome(){
        return await this.SubmitFlag.aggregate(
        [
            {
                $group :{
                    _id: "$user_id",
                    score : { $sum: "$score" }
                }
            },
            {
                $match : {
                    score : { $gte : 100}
                }
        
            },
            {
                $count: "count_user"
            }
        ]);

    }





}
