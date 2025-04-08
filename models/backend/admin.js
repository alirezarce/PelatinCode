import {MongoDB} from '../../global.js';
import AdminSchema from '../../schemas/admin.js';
import {log,toObjectId} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';

export default class AdminModel
{
    constructor(){
        this.model = MongoDB.db.model('admin', AdminSchema);
    }

    #hashPassword(password,admin_id){
        return crypto.hash(admin_id + password + admin_id);
    }

    async login(email,password){
        const row = await this.model.findOne({"email":email});
        if(row?._id)
        {   
            const result = row.toJSON();
            const admin_id = result?._id+'';
            password = this.#hashPassword(password,admin_id);
            log(password)
            if(password === result?.password)
            {
                if(result?.status === 2)
                {
                    delete result.password;
                    return result;//login success
                }
                else
                {   
                    switch(result?.status)
                    {
                        case 0:
                            return -2;//account is disabled 
                        case 1:
                            return -3;//account is blocked
                    }
                }
            }
            else
            {
                return -1;//email or password is not correct
            }
        }
        else
        {
            return -1;//email or password is not correct
        }
    }

    async getProfile(admin_id)
    {
        admin_id = toObjectId(admin_id);
        if(admin_id)
            return await this.model.findOne({"_id":admin_id});
        else    
            return null;        
        
    }


    async checkEmail(email)
    {
        return await this.model.findOne({"email":email}).countDocuments();
    }

    async saveProfile(admin_id,first_name,last_name,email,pass1,pass2,pass3,avatar)
    {
        const currentUser = await this.getProfile(admin_id);
        const last_edit_date_time = datetime.toString();
        const data = {
            first_name,last_name,last_edit_date_time
        };        

        if(avatar !== "")
        {
            data['avatar'] = avatar;
        }

        if(currentUser?.email !== email)
        {
            const emailIsDup = await this.checkEmail(email);
            if(emailIsDup > 0)
            {
                return -1;//email is already
            }
            data['email'] = email;
        }


        if(pass1 !== "" && pass2 !== "" && pass3 !== "")
        {
            if(this.#hashPassword(pass1,admin_id) === currentUser?.password)
            {
                data['password'] = this.#hashPassword(pass3,admin_id);
            }
            else
                return -2;//current password is not valid
        }



        await this.model.updateOne({"_id":admin_id},{
            "$set" : data
        });

        return 1;
    }

    async deleteAvatar(admin_id)
    {
        const data = {
            "avatar" : "",
            "last_edit_date_time" : datetime.toString()
        };

        await this.model.updateOne({"_id":admin_id},{
            "$set" : data
        });

        return 1;
    }
 



}
