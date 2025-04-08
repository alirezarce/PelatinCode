import BackendController from "../../core/BackendController.js";
import {validationResult,body} from 'express-validator';
import translate from "../../core/translate.js";
import crypto from '../../core/crypto.js';
import {isFile,unlink,fileExists} from '../../core/fs.js';
import {allowImageFileUpload,fileNameGenerator,toByte} from '../../core/uploader.js';
import {random,stringify,log, getEnv,getPath} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import OfflineCourseModel from '../../models/backend/offlineCourse.js';

export default class OfflineCourseController extends BackendController
{
    #url =  getEnv('BACKEND_URL') + 'offlineCourse/';

    constructor()
    {
        super();
        this.model = new OfflineCourseModel();
    }
    
    async add(req,res){
        try{
            const logo = req.session.category_add_data?.logo ?? '';
            const categories = await this.model.getCategories();            
            const data = {
                "title" : 'ثبت  دوره آفلاین  ',
                "categories":categories,
                "form_data" : req?.session?.category_add_data,
                
            }
            return res.render(this.templatePath+'offlineCourse/add',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async #validation(req){
        await body('title').not().isEmpty().withMessage("err1").run(req);
        await body('category_id').not().isEmpty().withMessage("err3").run(req);
        return validationResult(req);   
    }

    async postAdd(req,res){
        try{
            const title = this.safeString(this.input(req.body.title));
            const category_id = this.safeString(this.input(req.body.category_id));
            const status_price = this.safeString(this.input(req.body.status_price));
            const price = this.safeString(this.input(req.body.price));
            const status = this.safeString(this.input(req.body.status));
            const short_description = this.safeString(this.input(req.body.short_description));
            const long_description = this.input(req.body.long_description);
            const img_video3 = this.safeString(this.input(req.body.img_video3));
            const link_video1 = this.safeString(this.input(req.body.link_video1));
            const link_video2 = this.safeString(this.input(req.body.link_video2));
            const link_video3 = this.safeString(this.input(req.body.link_video3));
            const slug = this.safeString(this.input(req.body.slug));
            const title_seo = this.safeString(this.input(req.body.title_seo));
            const description_seo = this.safeString(this.input(req.body.description_seo));
            const formData = {title,status_price,price,status
                ,short_description,long_description,link_video1,link_video2
                ,link_video3,slug,title_seo,description_seo};
            req.session.offlineCourse_add_data = formData;
            
            if(!this.checkCsrfToken(req))
            {
                return res.redirect(`${this.#url}add/?msg=csrf_token_invalid`);
            }
            const result = await this.#validation(req);
            if(!result.isEmpty())
            {
                return res.redirect(`${this.#url}add/?msg=${result?.errors[0]?.msg}`);
            }  
            else
            {




//UPLOAD IMG 
  let img = req.session.user_add_data?.img ?? '';


if(img === "" && req?.files?.img)
{                    
    if(req.files.img.size <= toByte(1000,'MB'))
    {
       const ext = allowImageFileUpload(req.files.img.mimetype);
       if(ext !== '')
       {
            const fileName = 'img_offlineCourse/' + fileNameGenerator('img',ext);
            const path = getPath() + 'media/' + fileName;
            await req.files.img.mv(path);
            img = fileName;
       }
       else
       {
            return res.redirect(`${this.#url}add/?msg=upload-error-2`);
       }
    }
    else
    {
        return res.redirect(`${this.#url}add/?msg=upload-error-1`);
    }
}

              //UPLOAD Medium   IMG 
              let medium_img = req.session.user_add_data?.medium_img ?? '';


              if(medium_img === "" && req?.files?.medium_img)
              {                    
                  if(req.files.medium_img.size <= toByte(1000,'MB'))
                  {
                     const ext = allowImageFileUpload(req.files.medium_img.mimetype);
                     if(ext !== '')
                     {
                          const fileName = 'img_offlineCourse/' + fileNameGenerator('img_offlineCourse',ext);
                          const path = getPath() + 'media/' + fileName;
                          await req.files.medium_img.mv(path);
                          medium_img = fileName;
                     }
                     else
                     {
                          return res.redirect(`${this.#url}add/?msg=upload-error-5`);
                     }
                  }
                  else
                  {
                      return res.redirect(`${this.#url}add/?msg=upload-error-6`);
                  }
              }


//UPLOAD IMG VIDEO 1 
  let img_video1 = req.session.user_add_data?.img_video1 ?? '';


if(img_video1 === "" && req?.files?.img_video1)
{                    
    if(req.files.img_video1.size <= toByte(1000,'MB'))
    {
       const ext = allowImageFileUpload(req.files.img_video1.mimetype);
       if(ext !== '')
       {
            const fileName = 'img_offlineCourse/' + fileNameGenerator('img_video1',ext);
            const path = getPath() + 'media/' + fileName;
            await req.files.img_video1.mv(path);
            img_video1 = fileName;
       }
       else
       {
            return res.redirect(`${this.#url}add/?msg=upload-error-2`);
       }
    }
    else
    {
        return res.redirect(`${this.#url}add/?msg=upload-error-1`);
    }
}
//UPLOAD IMG VIDEO 2 
let img_video2 = req.session.user_add_data?.img_video2 ?? '';


if(img_video2 === "" && req?.files?.img_video2)
{                    
    if(req.files.img_video2.size <= toByte(1000,'MB'))
    {
       const ext = allowImageFileUpload(req.files.img_video2.mimetype);
       if(ext !== '')
       {
            const fileName = 'img_offlineCourse/' + fileNameGenerator('img_video2',ext);
            const path = getPath() + 'media/' + fileName;
            await req.files.img_video2.mv(path);
            img_video2 = fileName;
       }
       else
       {
            return res.redirect(`${this.#url}add/?msg=upload-error-2`);
       }
    }
    else
    {
        return res.redirect(`${this.#url}add/?msg=upload-error-1`);
    }
}

//UPLOAD IMG VIDEO 3 
let img_video3 = req.session.user_add_data?.img_video3 ?? '';


if(img_video3 === "" && req?.files?.img_video3)
{                    
    if(req.files.img_video3.size <= toByte(1000,'MB'))
    {
       const ext = allowImageFileUpload(req.files.img_video3.mimetype);
       if(ext !== '')
       {
            const fileName = 'img_offlineCourse/' + fileNameGenerator('img_video3',ext);
            const path = getPath() + 'media/' + fileName;
            await req.files.img_video3.mv(path);
            img_video3 = fileName;
       }
       else
       {
            return res.redirect(`${this.#url}add/?msg=upload-error-2`);
       }
    }
    else
    {
        return res.redirect(`${this.#url}add/?msg=upload-error-1`);
    }
}
                const resultAdd = await this.model.add(title,category_id,status_price,price,status
                    ,short_description,long_description,img,medium_img,img_video1,link_video1,img_video2,link_video2
                    ,img_video3,link_video3,slug,title_seo,description_seo);
                if(typeof resultAdd === 'number')
                    return res.redirect(`${this.#url}add/?msg=${resultAdd}`);
                else if(resultAdd?._id)
                {
                    delete req.session.course_add_data;
                    return res.redirect(`${this.#url}add/?msg=ok`);
                }
                else
                    return res.redirect(`${this.#url}add/?msg=error`);
            }
        }
        catch(e){
            
            return super.toError(e,req,res);
        }
    }
    #getParams(req){
        try{
            const title = this.safeString(this.input(req.query.title));
            const params = {
                title
            };
            const paramsQuery = this.toQuery(params);
            return {
                "params" : params,
                "params_query" : paramsQuery,
            }    
        }
        catch(e){
            return {
                "params" : {},
                "params_query" : '',
            }    
        }
    }

    async index(req,res){
        try{
            const sortFields = ['_id','title','last_edit_date_time','status'];
            const {page,sort_field,sort_type} = this.handlePagination(req,sortFields);
            const status_id = this.toObjectId(this.input(req.query.status_id),true);
            const status_value = this.toNumber(this.input(req.query.status_value),true);
            const del_id = this.toObjectId(this.input(req.query.del_id),true);
            const {params,params_query} = this.#getParams(req);
            const url = this.#url + '?' + params_query;
            const route_url = this.#url;
            const delete_url = url + `&page=${page}`;

            if(status_id !== '')
            {
                await this.model.changeStatus(status_id,status_value);
                return res.redirect(url + `&page=${page}&msg=status_changed`);
            }

            if(del_id !== '')
            {
                const delRow = await this.model.getRow(del_id);
                const path = getPath() + 'media/' + delRow.logo;
                await unlink(path);
                const resultDelete =  await this.model.deleteRow(del_id);
                if(resultDelete === 1)
                    return res.redirect(url + `&page=${page}&msg=delete_success`);
                else
                    return res.redirect(url + `&page=${page}&msg=delete_error`);
            }



            const pagination = await this.model.pagination(page,sort_field,sort_type,params?.title);
            const data = {
                "title" : 'لیست دوره های  آفلاین  ',
                "pagination" : pagination,
                "url" : url,
                "route_url" : route_url,
                "delete_url" : delete_url,
                "sortFields" : sortFields,
                "params" : params,
                "params_query" : params_query,
                "page" : page,
            }
            return res.render(this.templatePath+'offlineCourse/index',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async edit(req,res){
        try{
            const page = this.getPage(req);
            const {params,params_query} = this.#getParams(req);
            const back_url = this.#url + '?' + params_query + `&page=${page}`;
            const editId = this.toObjectId(this.input(req.params.edit_id),true);
            const del_id = this.toObjectId(this.input(req.params.del_id),true);
            const category_id = this.safeString(this.input(req.body.category_id));
            if(editId === '')
            {
                return res.redirect(back_url);
            }
            const rowData = await this.model.getRow(editId);
            if(!rowData)
            {
                return res.redirect(back_url);
            }
            const row = rowData.toJSON();
            const currentUrl = this.#url + `edit/${editId}/?` + params_query + `&page=${page}`;
            if(this.input(req.query.del) == '1')
            {
                const path = getPath() + 'media/img_offlineCourse' + row.img;
                await unlink(path);
                await this.model.deleteImg(editId);
                return res.redirect(currentUrl);
            }
            if(this.input(req.query.del) == '2')
                {
                    const path = getPath() + 'media/img_offlineCourse' + row.img_video1;
                    await unlink(path);
                    await this.model.deleteImgVideo1(editId);
                    return res.redirect(currentUrl);
                }
                if(this.input(req.query.del) == '3')
                    {
                        const path = getPath() + 'media/img_offlineCourse' + row.img_video2;
                        await unlink(path);
                        await this.model.deleteImgVideo2(editId);
                        return res.redirect(currentUrl);
                    }
                    if(this.input(req.query.del) == '4')
                        {
                            const path = getPath() + 'media/img_offlineCourse' + row.img_video3;
                            await unlink(path);
                            await this.model.deleteImgVideo3(editId);
                            return res.redirect(currentUrl);
                        }



                if(this.input(req.query.del) == '5')
                {
                    const path = getPath() + 'media/img_offlineCourse' + row.medium_img;
                    await unlink(path);
                    await this.model.deleteMediumImg(editId);
                    return res.redirect(currentUrl);
                           
                }
    
                const categories = await this.model.getCategories();         

            const data = {
                "title" : 'ویرایش   دوره آفلاین',
                "back_url" : back_url,
                "row" : row,
                "categories":categories,
                "delUrl" : currentUrl,
            }
            return res.render(this.templatePath+'offlineCourse/edit',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async postEdit(req,res){
        try{

            log(req.body);
            const page = this.getPage(req);
            const {params,params_query} = this.#getParams(req);
            const editId = this.toObjectId(this.input(req.params.edit_id),true);
            const url = this.#url + `edit/${editId}/?` + params_query + `&page=${page}`;
            const rowData = await this.model.getRow(editId);
            if(!rowData)
            {
                return res.redirect(url);
            }
            const row = rowData.toJSON();
            const title = this.safeString(this.input(req.body.title));
            const category_id = this.safeString(this.input(req.body.category_id));
            const status_price = this.safeString(this.input(req.body.status_price));
            const price = this.safeString(this.input(req.body.price));
            const status = this.safeString(this.input(req.body.status));
            const short_description = this.safeString(this.input(req.body.short_description));
            const long_description = this.input(req.body.long_description);
            const link_video1 = this.safeString(this.input(req.body.link_video1));
            const link_video2 = this.safeString(this.input(req.body.link_video2));
            const link_video3 = this.safeString(this.input(req.body.link_video3));
            const slug = this.safeString(this.input(req.body.slug));
            const title_seo = this.safeString(this.input(req.body.title_seo));
            const description_seo = this.safeString(this.input(req.body.description_seo));
            if(!this.checkCsrfToken(req))
            {
                return res.redirect(`${url}&msg=csrf_token_invalid`);
            }
            const result = await this.#validation(req);
            if(!result.isEmpty())
            {
                return res.redirect(`${url}&msg=${result?.errors[0]?.msg}`);
            }              
            else
            {
                

                //UPLOAD IMG 
  let img = row?.img ?? '';


  if(img === "" && req?.files?.img)
  {                    
      if(req.files.img.size <= toByte(1000,'MB'))
      {
         const ext = allowImageFileUpload(req.files.img.mimetype);
         if(ext !== '')
         {
              const fileName = 'img_offlineCourse/' + fileNameGenerator('img',ext);
              const path = getPath() + 'media/' + fileName;
              await req.files.img.mv(path);
              img = fileName;
         }
         else
         {
              return res.redirect(`${this.#url}add/?msg=upload-error-2`);
         }
      }
      else
      {
          return res.redirect(`${this.#url}add/?msg=upload-error-1`);
      }
  }

       //UPLOAD Medium IMG 
     let medium_img = row?.medium_img ?? '';
        if(medium_img === "" && req?.files?.medium_img)
                  {                    
                      if(req.files.medium_img.size <= toByte(1000,'MB'))
                      {
                         const ext = allowImageFileUpload(req.files.medium_img.mimetype);
                         if(ext !== '')
                         {
                              const fileName = 'img_offlineCourse/' + fileNameGenerator('img_offlineCourse',ext);
                              const path = getPath() + 'media/' + fileName;
                              await req.files.medium_img.mv(path);
                              medium_img = fileName;
                         }
                         else
                         {
                              return res.redirect(`${this.#url}edit/${editId}?msg=upload-error-8`);
                         }
                      }
                      else
                      {
                          return res.redirect(`${this.#url}edit/${editId}?msg=upload-error-7`);
                      }
        }
  
  
  //UPLOAD IMG VIDEO 1 
    let img_video1 = row?.img_video1 ?? '';
  
  
  if(img_video1 === "" && req?.files?.img_video1)
  {                    
      if(req.files.img_video1.size <= toByte(1000,'MB'))
      {
         const ext = allowImageFileUpload(req.files.img_video1.mimetype);
         if(ext !== '')
         {
              const fileName = 'img_offlineCourse/' + fileNameGenerator('img_video1',ext);
              const path = getPath() + 'media/' + fileName;
              await req.files.img_video1.mv(path);
              img_video1 = fileName;
         }
         else
         {
              return res.redirect(`${this.#url}add/?msg=upload-error-2`);
         }
      }
      else
      {
          return res.redirect(`${this.#url}add/?msg=upload-error-1`);
      }
  }
  //UPLOAD IMG VIDEO 2 
  let img_video2 = row?.img_video2 ?? '';
  
  
  if(img_video2 === "" && req?.files?.img_video2)
  {                    
      if(req.files.img_video2.size <= toByte(1000,'MB'))
      {
         const ext = allowImageFileUpload(req.files.img_video2.mimetype);
         if(ext !== '')
         {
              const fileName = 'img_offlineCourse/' + fileNameGenerator('img_video2',ext);
              const path = getPath() + 'media/' + fileName;
              await req.files.img_video2.mv(path);
              img_video2 = fileName;
         }
         else
         {
              return res.redirect(`${this.#url}add/?msg=upload-error-2`);
         }
      }
      else
      {
          return res.redirect(`${this.#url}add/?msg=upload-error-1`);
      }
  }
  
  //UPLOAD IMG VIDEO 3 
  let img_video3 = row?.img_video3 ?? '';
  
  
  if(img_video3 === "" && req?.files?.img_video3)
  {                    
      if(req.files.img_video3.size <= toByte(1000,'MB'))
      {
         const ext = allowImageFileUpload(req.files.img_video3.mimetype);
         if(ext !== '')
         {
              const fileName = 'img_offlineCourse/' + fileNameGenerator('img_video3',ext);
              const path = getPath() + 'media/' + fileName;
              await req.files.img_video3.mv(path);
              img_video3 = fileName;
         }
         else
         {
              return res.redirect(`${this.#url}add/?msg=upload-error-2`);
         }
      }
      else
      {
          return res.redirect(`${this.#url}add/?msg=upload-error-1`);
      }
  }

                const resultSave = await this.model.save(editId,title,category_id,status_price,price,status
                    ,short_description,long_description,img,medium_img,img_video1,link_video1,img_video2,link_video2
                    ,img_video3,link_video3,slug,title_seo,description_seo);
                if(resultSave === 1)
                    return res.redirect(`${url}&msg=ok`);
                else
                    return res.redirect(`${url}&msg=${resultSave}`);
            }

        }
        catch(e){
            return super.toError(e,req,res);
        }
    }



    async addVideo(req,res){
        try{
            const course = await this.model.getRow(req.params.course_id);
            const data = {
                "title" :"اضافه کردن ویدیو  جدید برای دوره آفلاین " + course.title,
                "form_data" : req?.session?.video_add_data,
            }
            return res.render(this.templatePath + 'offlineCourse/add_video',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }

    async #validationVideo(req){
        await body('title').not().isEmpty().withMessage("err1").run(req);
        await body('link').not().isEmpty().withMessage("err2").run(req);
        return validationResult(req);   
    }


    async postVideo(req,res){
        try{
            const {params,params_query} = this.#getParams(req);
            const course_id = this.toObjectId(this.input(req.params.course_id),true);
            const url = `${this.#url}add_video/${course_id}/`;
            const title = this.safeString(this.input(req.body.title));
            const link = this.safeString(this.input(req.body.link));
            const status = this.safeString(this.input(req.body.status));
            const formData = {title,link,status};
            req.session.flag_add_data = formData;
            log(req.params)

            if(!this.checkCsrfToken(req))
            {
                return res.redirect(`${url}?msg=csrf_token_invalid`);
            }
            const result = await this.#validationVideo(req);
            if(!result.isEmpty())
            {
                return res.redirect(`${url}?msg=${result?.errors[0]?.msg}`);
            }  
            else
            {

//UPLOAD IMG 
let img = req.session.user_add_data?.img ?? '';
if(img === "" && req?.files?.img)
{                    
    if(req.files.img.size <= toByte(1000,'MB'))
    {
       const ext = allowImageFileUpload(req.files.img.mimetype);
       if(ext !== '')
       {
            const fileName = 'img_video_offlineCourse/' + fileNameGenerator('img',ext);
            const path = getPath() + 'media/' + fileName;
            await req.files.img.mv(path);
            img = fileName;
       }
       else
       {
            return res.redirect(`${this.#url}add/?msg=upload-error-2`);
       }
    }
    else
    {
        return res.redirect(`${this.#url}add/?msg=upload-error-1`);
    }
}
            const resultAdd = await this.model.addVideo(course_id,title,link,img,status);
                if(typeof resultAdd === 'number')
                    return res.redirect(`${url}?msg=${resultAdd}`);
                else if(resultAdd?._id)
                {
                    delete req.session.flag_add_data;
                    return res.redirect(`${url}?msg=ok`);
                }
                else
                    return res.redirect(`${url}?msg=error`);
            }
        }
        catch(e){
            
            return super.toError(e,req,res);
        }
    }


    async listVideos(req, res){
        try{
            const page = this.getPage(req);
            const {params,params_query} = this.#getParams(req);
            const status_id = this.toObjectId(this.input(req.query.status_id),true);
            const status_value = this.toNumber(this.input(req.query.status_value),true);
            const course_id = this.toObjectId(this.input(req.params.course_id),true);
            const url = this.#url + 'list_videos/' +course_id+'?' +params_query;
            const rows = await this.model.getVideoList(course_id);
            const del_id = this.toObjectId(this.input(req.query.del_id),true);
            const delete_url = url + `&page=${page}`;
            const route_url =  this.#url + 'edit_video/' + course_id + '/';
            if(status_id !== '')
            {
                await this.model.changeStatusVideo(status_id,status_value);
                return res.redirect(`${url}&msg=status_changed`);
            }

            if(del_id !== '')
            {
                const resultDelete =  await this.model.deleteRowVideo(del_id);
                if(resultDelete === 1)
                    return res.redirect(url + `&id=${del_id}&page=${page}&msg=delete_success`);
                else
                    return res.redirect(url + `&page=${page}&msg=delete_error`);
            }
            const data = {
                "title" :"لیست  ویدیو های دوره آفلاین " ,
                "rows":rows,
                "route_url":route_url,
                "delete_url" : delete_url,
                "url" : url,
                "form_data" : req?.session?.category_add_data,
            }
            return res.render(this.templatePath + 'offlineCourse/list_videos',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async editVideo(req,res){
        try{
            log(req.params)
            const course_id = this.toObjectId(this.input(req.params.course_id),true);
            const edit_id = this.toObjectId(this.input(req.params.edit_id),true);
            const url = this.#url + `edit_video/${course_id}/${edit_id}/?`;
            const back_url = this.#url + `list_videos/${course_id}/?`;
            const currentUrl = this.#url + `edit/${edit_id}/?`;
            const id = this.toObjectId(this.input(req.params.edit_id),true);
            log(edit_id)
            const rowData = await this.model.getVideoById(id);
            log(rowData)
            const row = rowData.toJSON();

            if(this.input(req.query.del) == '1')
            {
                const path = getPath() + 'media/img_video_offlineCourse' + row.img;
                await unlink(path);
                await this.model.deleteImgVideoCourse(edit_id);
                return res.redirect(url);
            }
            const data = {
                "title" :"ویرایش   " + row.title,
                "row":row,
                "back_url":back_url,
                "url":url,
            }
            return res.render(this.templatePath + 'offlineCourse/edit_video',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }
   
    async postEditVideo(req,res){
     try{
            const course_id = this.toObjectId(this.input(req.params.course_id),true);
            const edit_id = this.toObjectId(this.input(req.params.edit_id),true);
            log('course_id'+course_id)
            log('edit_id'+edit_id)
            const url = this.#url + `edit_video/${course_id}/${edit_id}/?`;
            const title = this.safeString(this.input(req.body.title));
            const link = this.safeString(this.input(req.body.link));
            const status = this.safeString(this.input(req.body.status));
            const rowData = await this.model.getRowVideo(edit_id);
            if(!rowData)
            {
                return res.redirect(url);
            }
            const row = rowData.toJSON();
            if(!this.checkCsrfToken(req))
            {
                return res.redirect(`${this.#url}edit_flag/${editId}?msg=csrf_token_invalid`);
            }
            else
            {

                 //UPLOAD IMG 
  let img = row?.img ?? '';


  if(img === "" && req?.files?.img)
  {                    
      if(req.files.img.size <= toByte(1000,'MB'))
      {
         const ext = allowImageFileUpload(req.files.img.mimetype);
         if(ext !== '')
         {
              const fileName = 'img_video_offlineCourse/' + fileNameGenerator('img',ext);
              const path = getPath() + 'media/' + fileName;
              await req.files.img.mv(path);
              img = fileName;
         }
         else
         {
              return res.redirect(`${this.#url}add/?msg=upload-error-2`);
         }
      }
      else
      {
          return res.redirect(`${this.#url}add/?msg=upload-error-1`);
      }
  }
  
                const result = await this.#validationVideo(req);
                if(!result.isEmpty())
                {
                    return res.redirect(`${url}&msg=${result?.errors[0]?.msg}`);
                }      
                        
                const resultSave =await this.model.saveVideo(edit_id,title,link,img,status);
                if(resultSave === 1)
                    return res.redirect(`${url}&msg=ok`);
                else
                    return res.redirect(`${url}&msg=${resultSave}`);
            }
        }
        catch(e){
            
            return super.toError(e,req,res);
        }
    }


   





}
