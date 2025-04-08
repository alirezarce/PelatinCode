import {Schema} from 'mongoose';

export default new Schema({
    title : {
        type : String,
        required : true,
    },
    status : {
        type : Boolean,
        required : true
    },
    last_edit_date_time : {
        type : Date,
    },
    description : {
        type : String
    },
    type_team : {
        type : Number,
        default : 0
    },
});