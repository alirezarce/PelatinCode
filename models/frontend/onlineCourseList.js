import {MongoDB} from '../../global.js';
import CategoryOnlineCourseSchema from '../../schemas/categoryOnlineCourse.js';
import OnlineCourseSchema from '../../schemas/onlineCourse.js';

export default class OnlineCourseListModel
{
    constructor(){
        this.model = MongoDB.db.model('online_course',OnlineCourseSchema);
        this.CategoryOnlineCourseSchema = MongoDB.db.model('category_online_course',CategoryOnlineCourseSchema);
    }

    async pagination(category_id = null ,page){
        const where = {
            "status" : true
        };
        if(category_id)
        {
            where['category_id'] = category_id;
        }
        const ROWS_PRE_PAGE = 6;
        const skip = Math.abs(ROWS_PRE_PAGE * page - ROWS_PRE_PAGE);
        console.log('skip'+skip);
        const totalRows = await this.model.findOne(where).countDocuments();
        const totalPage = Math.ceil(totalRows / ROWS_PRE_PAGE);
        const rows =  await this.model.find(where)
        .populate('category_id')
        .sort([['_id',-1]])
        //.skip(skip)
        .limit(ROWS_PRE_PAGE);  
        
        return {
        rows,totalRows,totalPage
        };
    }

    async getFaceToFaceCourse(slug){
        return await this.model.findOne({"slug":slug,"status":true})
        .populate('category_id')
    }

    async getCategory(slug){
        return await this.CategoryOnlineCourseSchema.findOne({"slug":slug,"status":true});
    }
    async getCategoryByID(id){
        return await this.CategoryOnlineCourseSchema.findOne({"_id":id,"status":true});
    }

    
    async getCount(category_id){
        return await this.model.findOne({"category_id":category_id
            ,"status":true}).countDocuments();
    }


    async getLastOnlineCourse(){
        return await this.model.find().populate('category_id').limit(6).sort([['_id',-1]])
    }


 


}



