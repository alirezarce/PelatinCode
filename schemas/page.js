import {Schema} from 'mongoose';

export default new Schema({
    title : {
        type : String,
        required : true,
    },
    last_edit_date_time : {
        type : Date,
    },
    slug : {
        type : String,
        required : true,
        unique : true,
    },
    title_seo : {
        type : String
    },
    description_seo : {
        type : String
    },
    content : {
        type : String
    },
});