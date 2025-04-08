import {Schema} from 'mongoose';

export default new Schema({
    title : {
        type : String,
        required : true,
    },
    link : {
        type : String,
    },
    img : {
        type : String,
    },
    last_edit_date_time : {
        type : Date,
    },

    content : {
        type : String
    },
});