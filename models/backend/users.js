import {MongoDB} from '../../global.js';
import UserSchema from '../../schemas/user.js';
import {log,toObjectId,getEnv} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';
import UserGroupSchema from '../../schemas/userGroup.js';


export default class UsersModel
{
    constructor(){
        this.model = MongoDB.db.model('user', UserSchema);
        this.UserGroupModel = MongoDB.db.model('user_group', UserGroupSchema);

    }

    #hashPassword(password,id){
        return crypto.hash(id + password + id + id);
    }


    async #checkEmail(email){
        return await this.model.findOne(
            {
                "email":email,
            }
        ).countDocuments();
    }

    async #checkMobile(mobile){
        return await this.model.findOne(
            {
                "mobile":mobile,
            }
        ).countDocuments();
    }
    async addUser(fn,ln,mobile,email,date_birth_shamsi,date_birth_ghamari,group_id,gender,country,pass1,pass2,address,status)  {

        const register_date_time = datetime.toString();
        const data = {
            fn,ln,email,mobile,date_birth_shamsi,date_birth_ghamari,address,group_id,gender,country,register_date_time,status
        };

        if (email != "") {
                const emailIsDup = await this.#checkEmail(email);
                if (emailIsDup > 0) {
                    return -1;//email is already
                }
                data['email'] = email;
            
        }

        if (mobile != "") {
            const mobileIsDup = await this.#checkMobile(mobile);
            if (mobileIsDup > 0) {
                return -2;//mobile is already
            }
            data['mobile'] = mobile;
        
        }
        const row = new this.model({
            fn, ln,mobile, email,register_date_time
        })
        await row.save();

        //step2 => register complated with hash password

        const userRow = await this.model.findOne({ "mobile": mobile });
        //console.log(userRow);
        const user_id = userRow?._id + '';
        //user_id = toObjectId(user_id);    
        if(pass1!==pass2){
            log('pass is not match ')
            return -3;
        }
        if (pass1 !== "" && pass2 !== "") {
           
            data['password'] = this.#hashPassword(pass2,user_id);
            
        }
        
        await this.model.updateOne({ "_id": user_id }, {
            "$set": data
        });

        return 1;
    }

    async pagination(page,sortField,sortType,mobile,email,fn){
        const where = {};


        if(email != '')
        {
            where['email'] = {$regex: '.*' + email + '.*', "$options": "i"};
        }

        if(mobile != '')
        {
            where['mobile'] = {$regex: '.*' + mobile + '.*', "$options": "i"};
        }
        if(fn != '')
        {
                where['fn'] = {$regex: '.*' + fn + '.*', "$options": "i"};
        }

        const ROWS_PRE_PAGE = getEnv('ROWS_PRE_PAGE','number');
        const skip = Math.abs(ROWS_PRE_PAGE * page - ROWS_PRE_PAGE);
        const totalRows = await this.model.findOne(where).countDocuments();
        const totalPage = Math.ceil(totalRows / ROWS_PRE_PAGE);
        const rows =  await this.model.find(where).sort([[sortField,sortType]]).populate('group_id')
        .skip(skip)
        .limit(ROWS_PRE_PAGE);

        return {
            rows,totalRows,totalPage
        };

    }


    async changeStatus(status_id,status_value){
        const last_edit_date_time = datetime.toString();
        const data = {
            "status" : status_value,
            "last_edit_date_time" : last_edit_date_time,
        };
        
        await this.model.updateOne({"_id":status_id},{
            "$set" : data 
        });

        return 1;
    }

    async getRow(id){
        return await this.model.findOne({"_id":id});
    }

    async save(id,fn,ln,mobile,email,date_birth_shamsi,date_birth_ghamari,group_id,gender,country,pass1,pass2,address,status){
        if(!toObjectId(id))
        {
            return 0;
        }
        const currentRow = await this.getRow(id);
        if(!currentRow)
            return 0;
    
        const last_edit_date_time = datetime.toString();
        const data = {
            "last_edit_date_time" : last_edit_date_time,
            "fn":fn,
            "ln":ln,
            "date_birth_shamsi":date_birth_shamsi,
            "date_birth_ghamari":date_birth_ghamari,
            "group_id":group_id,
            "gender":gender,
            "country":country,
            "address":address,
            "status":status

        };

        if(currentRow['email'] !== email)
        {
            const isDup = await this.#checkEmail(email);
            console.log(isDup);
            if(isDup > 0)
            {
                log('email is already')
                return -1;//email is already
                
            }
            else
            {
                data['email'] = email;
            }    
        }
        if(currentRow['mobile'] !== mobile)
        {
                const isDup = await this.#checkMobile(mobile);
                if(isDup > 0)
                {
                    return -1;//email is already
                }
                else
                {
                    data['mobile'] = mobile;
                }    
        }

        if (pass1 !== "" && pass2 !== "") {
            if(pass1!==pass2){
                log('pass is not match ')
                return -3;
            }
            data['password'] = this.#hashPassword(pass2,id);
        }
           
       
        const result = await this.model.updateOne({"_id":id},{
            "$set" : data 
        });

        if(result?.modifiedCount > 0)
            return 1;
        else
            return 0;

    }

    async changeVerify(id){
        const last_edit_date_time = datetime.toString();
        const data = {
            "is_verify" : true,
            "last_edit_date_time" : last_edit_date_time,
        };
        
        await this.model.updateOne({"_id":id},{
            "$set" : data 
        });

        return 1;
    }

    async getGroup(title){
        const where = {};

        if(title !== '')
        {
            where['title'] = {$regex: '.*' + title + '.*', "$options": "i"};
        }
       
        const rows =  await this.UserGroupModel.find(where).select({"title":1})
        return rows;
      
    }

    async getAllUserByFn(fn){
        const where = {};

        if(fn !== '')
        {
            where['fn'] = {$regex: '.*' + fn + '.*', "$options": "i"};
        }
       
        const rows =  await this.model.find(where).select({"fn":1,"ln":1})
        return rows;
        
    
    }

    async getAllUserByMobile(mobile){
        const where = {};

        if(mobile !== '')
        {
            where['mobile'] = {$regex: '.*' + mobile + '.*', "$options": "i"};
        }
       
        const rows =  await this.model.find(where).select({"mobile":1})
        return rows;
        
    }
    async getAllUserByMobile(mobile){
        const where = {};

        if(mobile !== '')
        {
            where['mobile'] = {$regex: '.*' + mobile + '.*', "$options": "i"};
        }
       
        const rows =  await this.model.find(where).select({"mobile":1})
        return rows;
        
    }
    async getUserByMobile(mobile){
        return  await this.model.findOne({"mobile":mobile});
    }


  
    async deleteRow(id){
        if(!toObjectId(id))
        {
            return 0;
        }
        const currentRow = await this.getRow(id);
        if(!currentRow)
            return 0;
        
        await this.model.deleteOne({"_id":id});
        return 1;

    }


    async getCountAllUser(){
        return await this.model.find({}).countDocuments();
    }

    async getCountAllUserActive(){
        return await this.model.find({"status":1}).countDocuments();
    }

    async getAllUserByGroupId(id){
        return await this.model.find({"group_id":id});
    }

    async getAllUsersMobile(){
        return await this.model.find({}).select({"mobile":1});
    }





    
    


}



