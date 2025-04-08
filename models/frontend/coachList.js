import {MongoDB} from '../../global.js';
import CoachSchema from '../../schemas/coach.js';

export default class CoachListModel
{
    constructor(){
        this.model = MongoDB.db.model('coach',CoachSchema);
       
    }


    async getCoach(slug){
        return await this.model.findOne({"slug":slug,"status":true})
      
    }
    async getAllCoach(){
        return await this.model.find({});
      
    }

    async pagination(page){
        const where = {
            "status" : true
        };
        const ROWS_PRE_PAGE = 6;
        const skip = Math.abs(ROWS_PRE_PAGE * page - ROWS_PRE_PAGE);
        const totalRows = await this.model.findOne(where).countDocuments();
        const totalPage = Math.ceil(totalRows / ROWS_PRE_PAGE);
        const rows =  await this.model.find(where)
        .sort([['_id',-1]])
        //.skip(skip)
        .limit(ROWS_PRE_PAGE);   
        return {
        rows,totalRows,totalPage
        };
    }
    
    


}



