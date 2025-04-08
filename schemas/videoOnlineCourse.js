import {Schema} from 'mongoose';

export default new Schema({
    title : {
        type : String,
        unique : true,
        
    },

    link : {
        type : String,
    },

    img:{
        type :String,
    },

    course_id : {
        type : Schema.Types.ObjectId,
        ref : "online_course"
    },
    status : {
        type : Number,
        default : 1
    },
    last_edit_date_time : {
        type : Date,
    },

});
