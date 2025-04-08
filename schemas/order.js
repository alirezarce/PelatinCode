import {Schema} from 'mongoose';
export default new Schema({
    title:{
        type:String
    },
    type:{
        type:Number
    },
    user_id : {
        type : Schema.Types.ObjectId,
        ref : "user"
    },
    course_id : {
        type : Schema.Types.ObjectId,
    },
    trans_id : {
        type : String
    },
    price:{
        type:Number
    },
    date_time:{
        type : Date,
    },
    status:{
        type:Boolean
    },
    slug : {
        type : String
    },
    expire_time:{
        type : Date,
    }
   

});