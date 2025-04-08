
import {MongoDB} from '../../global.js';
import OnlineCourseSchema from '../../schemas/onlineCourse.js';
import VideoOnlineCourseSchema from '../../schemas/videoOnlineCourse.js';



export default class OnlineCourseModel
{
    constructor(){
        this.model = MongoDB.db.model('online_course',OnlineCourseSchema);
        this.VideoOnlineCourseModel = MongoDB.db.model('video_online_course', VideoOnlineCourseSchema);
    }

     async getCourse(slug){
        return await this.model.findOne({"slug":slug,"status":1});
    }

    async getCourseByTitle(title){
        const res = await this.model.findOne({"title":title,"status":1});
        return await this.VideoOnlineCourseModel.find({"course_id":res._id});
    }

    

    async getVideoCourse(course_id){
        return await this.VideoOnlineCourseModel.find({"course_id":course_id,"status":1});
    }






}



