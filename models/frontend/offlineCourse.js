
import {MongoDB} from '../../global.js';
import OfflineCourseSchema from '../../schemas/offlineCourse.js';
import {log,toObjectId,getEnv} from '../../core/utils.js';
import VideoOfflineCourseSchema from '../../schemas/videoOfflineCourse.js';



export default class OfflineCourseModel
{
    constructor(){
        this.model = MongoDB.db.model('offline_course',OfflineCourseSchema);
        this.VideoOfflineCourseModel = MongoDB.db.model('video_offline_course', VideoOfflineCourseSchema);
        
       
    }

    async getCourse(slug){
        return await this.model.findOne({"slug":slug,"status":1})
        
    }

    async getCourseByTitle(title){
        const res = await this.model.findOne({"title":title,"status":1});
        return await this.VideoOfflineCourseModel.find({"course_id":res._id});
    }


    async getVideoCourse(course_id){
        return await this.VideoOfflineCourseModel.find({"course_id":course_id,"status":1});
    }






}



