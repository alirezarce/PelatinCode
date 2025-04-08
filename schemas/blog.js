import {Schema} from 'mongoose';

export default new Schema({
    title : {
        type : String,
        unique : true,
    },
    category_id : {
        type : Schema.Types.ObjectId,
        ref : "category_blog"
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
});
