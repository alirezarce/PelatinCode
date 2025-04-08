
import {MongoDB} from '../../global.js';
import FaceToFaceCourseSchema from '../../schemas/faceTofaceCourse.js';
import {log,toObjectId,getEnv} from '../../core/utils.js';


export default class FaceToFaceCourseModel
{
       constructor(){
           this.model = MongoDB.db.model('facetoface_course',FaceToFaceCourseSchema);
          
       }
   

       async getCourse(slug){
           return await this.model.findOne({"slug":slug,"status":1})
           
       }
       
   
   
}



