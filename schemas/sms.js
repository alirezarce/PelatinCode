import {Schema} from 'mongoose';

export default new Schema({
    title : {
        type : String,   
    },
    mobile:{
        type : String
    },
    message:{
        type:String
    },
    last_send_date_time : {
        type : Date,
    },
    status: {
        type: Number,
        default:1,
        required: true
    },
    type: {
        type: String,
       
    },
    timestamp:{
        type: String,
    }
    
});