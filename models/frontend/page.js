
import {MongoDB} from '../../global.js';
import PageSchema from '../../schemas/page.js';
import {log,toObjectId,getEnv} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import crypto from '../../core/crypto.js';

export default class ChallengeModel
{
    constructor(){
        this.model = MongoDB.db.model('page',PageSchema);
    }

    async getPage(slug){
        return await this.model.findOne({"slug":slug});
    }
}



