import {MongoDB} from '../../global.js';
import UserSchema from './../../schemas/user.js';
import {log,toObjectId,getEnv} from './../../core/utils.js';
import datetime from './../../core/datetime.js';
import crypto from './../../core/crypto.js';


export default class UserModel
{
    constructor(){
         this.model = MongoDB.db.model('user', UserSchema);
       
    }

    #hashPassword(password,id){
        return crypto.hash(id + password + id + id);
    }

    async register(mobile,password){
        // log(11)
        const register_date_time = datetime.toString();
        const isDupMobile = await this.#checkMobile(mobile);
        if(isDupMobile > 0)
        {
            return -1;//mobile is already
        }

        const row = new this.model({
            register_date_time,mobile
        });

        // console.log(mobile)
        const result = await row.save();
        if(result)
        {
            const passwordHash = this.#hashPassword(password,result._id+'');
            const resultSave = await this.model.updateOne({"_id":result._id},{
                "$set" : {"password":passwordHash} 
            });   
            return result._id+'';
        }
        else
        {
            return -3;
        }
    }

    async #checkUsername(username){
        return await this.model.findOne(
            {
                "username":username
            }
        ).countDocuments();
    }

    async #checkEmail(email){
        return await this.model.findOne(
            {
                "email":email
            }
        ).countDocuments();
    }
    async #checkMobile(mobile){
        return await this.model.findOne(
            {
                "mobile":mobile
            }
        ).countDocuments();
    }

    async checkMobile(mobile){
        return await this.model.findOne(
            {
                "mobile":mobile,
                "is_verify":true
            }
        ).countDocuments();
    }
    
    
    async sendRegisterActiveLink(email){
        const user = await this.model.findOne({"email":email});
        if(user)
        {
            if(!user.is_verify)
            {
                return user._id+'';
            }
            else
            {
                return 0;
            }
        }
        else
        {
            return 0;
        }
    }


    async getRow(id){
        return await this.model.findOne({"_id":id});
    }


    async getUserByMobile(mobile){
        return await this.model.findOne({"mobile":mobile});
    }

    async verifyUser(id){
        const verify_date_time = datetime.toString();
        const data = {
            "is_verify" : true,
            "verify_date_time" : verify_date_time,
        };
        
        await this.model.updateOne({"_id":id},{
            "$set" : data 
        });

        return 1;
    }

    async login(mobile,password){
        const row = await this.model.findOne({"mobile":mobile});
        if(row?._id)
        {   
            const result = row.toJSON();
            const user_id = result?._id+'';
            password = this.#hashPassword(password,user_id);
            if(password === result?.password)
            {
                if(result?.status === 1)
                {
                    if(result?.is_verify)
                    {
                        delete result.password;
                        return result;//login success    
                    }
                    else
                    {
                        return -3;//acount not acive
                    }
                }
                else
                {   
                    return -2;//account is block
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

    async sendRecoveryLink(email){
        const user = await this.model.findOne({"email":email});
        if(user)
        {
            if(user.status == 1 && user.is_verify)
            {
                return user._id+'';
            }
            else
            {
                return 0;
            }
        }
        else
        {
            return 0;
        }
    }


    async resetPassword(mobile,password){
        const last_edit_date_time = datetime.toString();
        const userInfo = await this.getUserByMobile(mobile);
        const data = {
            "password" : this.#hashPassword(password,userInfo?._id),
        };
        
        await this.model.updateOne({"mobile":mobile},{
            "$set" : data 
        });

        return 1;
    }

    

        async save(id,fn,ln,email,date_birth_shamsi,date_birth_ghamari,pass1,pass2,pass3,address,avatar){
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
                "address":address,
    
            };
            if(avatar !== "")
                {
                    data['avatar'] = avatar;
                }
    
            if(currentRow['email'] !== email)
            {
                const isDup = await this.#checkEmail(email);
                if(isDup > 0)
                {
                    return -1;//email is already
                }
                else
                {
                    data['email'] = email;
                }    
            }
            

    
            if(pass1 !== "" && pass2 !== "" && pass3 !== "")
                {
                    if(this.#hashPassword(pass1,user_id) === currentUser?.password)
                    {
                        data['password'] = this.#hashPassword(pass3,user_id);
                    }
                    else
                        return -2;//current password is not valid
                }


                log(data)
            const result = await this.model.updateOne({"_id":id},{
                "$set" : data 
            });
    
            if(result?.modifiedCount > 0)
                return 1;
            else
                return 0;
    
        }
    async saveProfile(user_id,username,pass1,pass2,pass3,avatar)
    {
        const currentUser = await this.getRow(user_id);
        const last_edit_date_time = datetime.toString();
        const data = {
            last_edit_date_time
        };        

        if(avatar !== "")
        {
            data['avatar'] = avatar;
        }

        if(currentUser?.username !== username)
        {
            const usernameIsDup = await this.#checkUsername(username);
            if(usernameIsDup > 0)
            {
                return -1;//username is already
            }
            data['username'] = username;
        }


        if(pass1 !== "" && pass2 !== "" && pass3 !== "")
        {
            if(this.#hashPassword(pass1,user_id) === currentUser?.password)
            {
                data['password'] = this.#hashPassword(pass3,user_id);
            }
            else
                return -2;//current password is not valid
        }



        await this.model.updateOne({"_id":user_id},{
            "$set" : data
        });

        return 1;
    }

    async deleteAvatar(user_id)
    {
        const data = {
            "avatar" : "",
            "last_edit_date_time" : datetime.toString()
        };

        await this.model.updateOne({"_id":user_id},{
            "$set" : data
        });

        return 1;
    }

    async saveSkyRoomUserId(id,skyRoomUser_id){
        if(!toObjectId(id))
        {
            return 0;
        }
        console.log(id);
        console.log(skyRoomUser_id);
        const currentRow = await this.getRow(id);
        if(!currentRow)
            return 0;
    
        const data = {
        "skyRoomUser_id":skyRoomUser_id 
        };    

        const result = await this.model.updateOne({"_id":id},{
            "$set" : data 
        });

        
        if(result?.modifiedCount > 0)
            return 1;
        else
            return 0;

    }





}



 