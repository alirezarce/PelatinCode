import { random } from "./utils.js";
import datetime from "./datetime.js";
import crypto from "./crypto.js";

export function allowImageFileUpload(mime_type)
{
    try{
        const mimeTypes = [
            {"mime_type":"image/png","ext":"png"},
            {"mime_type":"image/jpeg","ext":"jpeg"},
            {"mime_type":"image/jpg","ext":"jpg"},
            {"mime_type":"image/gif","ext":"gif"},
        ];  
        const result =  mimeTypes.find((item) => {
            return item.mime_type === mime_type
        });    

        return result?.ext ?? '';
    }
    catch(e){
        return '';
    }
}


export function fileNameGenerator(name,ext)
{
    return  name + '-' +  crypto.hash(datetime.getTimeStamp() + random(1000000000000,9999999999999)) + '.' + ext;
}


export function toByte(size,type = 'B')
{
    try{
        const types = ["B", "KB", "MB", "GB", "TB"];
        const key = types.indexOf(type.toUpperCase());
        if (typeof key !== "boolean") 
            return size * 1024 ** key;    
        else
            return 0;
    }
    catch(e){
        return 0;
    }
}

