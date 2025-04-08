import {Schema} from 'mongoose';

export default new Schema({
    fn : {
        type : String,
        
    },
    ln: {
        type: String,
      
    },
    mobile: {
        type: String,
        required: true,
    },
    date_birth_ghamari:{
        type: String,
    },
    date_birth_shamsi:{
        type:String
    },
    group_id : {
        type : Schema.Types.ObjectId,
        ref : "user_group"
    },
    age : {
        type : Number
    },
    address : {
        type : String
    },
    email : {
        type : String,
        default:"",
    },
    password : {
        type : String,
    },
    status: {
        type: Number,
        default:1,
        required: true
    },
    register_date_time: {
        type: Date,
        required: true
    },
    last_edit_date_time: {
        type: Date,
    },
    avatar: {
        type: String
    },
    verify_date_time : {
        type : Date,
    },
    is_verify : {
        type : Boolean,
        default : false
    },
    gender : {
        type : Number,
        default : 0
    },
    country : {
        type: String
    },
    skyRoomUser_id:{
        type: Number
    }

});