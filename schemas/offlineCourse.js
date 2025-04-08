import {Schema} from 'mongoose';

export default new Schema({
    title : {
        type : String,
        unique : true,
    },
    category_id : {
        type : Schema.Types.ObjectId,
        ref : "category_offline_course"
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
    img_video1 : {
        type : String
    },
    img_video2 : {
        type : String
    },
    img_video3 : {
        type : String
    },
    link_video1 : {
        type : String
    },
    link_video2 : {
        type : String
    },
    link_video3 : {
        type : String
    },
    img : {
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
    price:{
        type : Number,
        default : 0
    },
    medium_img:{
        type : String
    },
});
