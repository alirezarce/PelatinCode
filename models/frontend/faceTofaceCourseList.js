import {MongoDB} from '../../global.js';
import CategoryFaceToFaceCourseSchema from '../../schemas/categoryFaceToFaceCourse.js';
import FaceToFaceCourseSchema from '../../schemas/faceTofaceCourse.js';

export default class BlogListModel
{
    constructor(){
        this.model = MongoDB.db.model('facetoface_course',FaceToFaceCourseSchema);
        this.CategoryFaceToFaceCourseModel = MongoDB.db.model('category_facetoface_course',CategoryFaceToFaceCourseSchema);
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

    async paginationAll( page){
        const where = {
            "status" : true
        };
        const ROWS_PRE_PAGE = 6;
        const skip = Math.abs(ROWS_PRE_PAGE * page - ROWS_PRE_PAGE);
        const totalRows = await this.model.findOne(where).countDocuments();
        const totalPage = Math.ceil(totalRows / ROWS_PRE_PAGE);
        const rows =  await this.model.find(where)
        .sort([['_id',-1]])
        // .limit(ROWS_PRE_PAGE);   
        return {
        rows,totalRows,totalPage
        };
    }

    async getFaceToFaceCourse(slug){
        return await this.model.findOne({"slug":slug,"status":true})
        .populate('category_id')
    }

    async getCategory(slug){
        return await this.CategoryFaceToFaceCourseModel.findOne({"slug":slug,"status":true});
    }
    async getCategoryByID(id){
        return await this.CategoryFaceToFaceCourseModel.findOne({"_id":id,"status":true});
    }



    
    async getCount(category_id){
        return await this.model.findOne({"category_id":category_id
            ,"status":true}).countDocuments();
    }


    async getLastFaceToFaceCourse(){
        return await this.model.find().populate('category_id').limit(6).sort([['_id',-1]])
    }


 


}



