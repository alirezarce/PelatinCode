import {Schema} from 'mongoose';

export default new Schema({
    title : {
        type : String,
        required : true,
    },
    last_edit_date_time : {
        type : Date,
    },
    title_seo : {
        type : String
    },
    description_seo : {
        type : String
    },
    mobile: {
        type: String,
        
    },
    phone: {
        type: String,
        
    },
    link_instagram : {
        type : String,
    },
    link_telegram : {
        type : String,
    },
    link_linkdin: {
        type : String,
    },
    email: {
        type : String,
    },
    icon:{
        type : String
    },
    logo:{
        type : String
    },
    logo_dark:{
        type : String
    },
    footer_content:{
        type : String
    },
    address:{
        type : String
    },
    content_birth:{
        type:String
    }

});