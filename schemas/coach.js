import {Schema} from 'mongoose';

export default new Schema({
    name : {
        type : String,
        unique : true,
    },
    short_description : {
        type : String
    },
    long_description : {
        type : String
    },
    status : {
        type : Number,
        default : 0
    },
    sex : {
        type : Number,
        default : 0
    },
    img : {
        type : String
    },
    big_img : {
        type : String
    },
    medium_img:{
        type : String
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

});
