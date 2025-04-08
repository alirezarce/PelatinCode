import BackendController from "../../core/BackendController.js";
import {validationResult,body} from 'express-validator';
import {random,stringify,log,toObjectId, getEnv,getPath} from '../../core/utils.js';
import datetime from '../../core/datetime.js';
import {allowImageFileUpload,fileNameGenerator,toByte} from '../../core/uploader.js';
import {isFile,unlink,fileExists} from '../../core/fs.js';
import FaceToFaceCourseModel from '../../models/backend/faceTofaceCourse.js';

export default class BlogController extends BackendController
{
    #url =  getEnv('BACKEND_URL') + 'FaceToFaceCourse/';

    constructor()
    {
        super();
        this.model = new FaceToFaceCourseModel();
    }

  

    
    async add(req,res){
        try{
            const category_id = this.toObjectId(req?.session?.blog_add_data?.category_id,true);
            const categories = await this.model.getCategories();            
            const data = {
                "title" :"ثبت  دوره حضوری",
                "categories":categories,
                "form_data" : req?.session?.blog_add_data,
            }
            return res.render(this.templatePath + 'FaceToFaceCourse/add',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async #validation(req){
        await body('title').not().isEmpty().withMessage("err1").run(req);
        await body('category_id').not().isEmpty().withMessage("err3").run(req);
        await body('short_description').not().isEmpty().withMessage("err6").run(req);
        await body('long_description').not().isEmpty().withMessage("err7").run(req);
        await body('description_seo').not().isEmpty().withMessage("err8").run(req);
        await body('title_seo').not().isEmpty().withMessage("err9").run(req);
        await body('slug').not().isEmpty().withMessage("err10").custom(() => {
            const slug = this.input(req.body.slug);
            const check = /^[a-z0-9-]+$/.test( slug );
            if(check)
                return true;
            else
                throw new Error("err11");
        }).run(req);
        return validationResult(req);   
    }

    async postAdd(req,res){
        try{
            const title = this.safeString(this.input(req.body.title));
            const category_id = this.safeString(this.input(req.body.category_id));
            const status = this.safeString(this.input(req.body.status));
            const short_description = this.safeString(this.input(req.body.short_description));
            const long_description = this.input(req.body.long_description);
            const price = this.input(req.body.price);
            const img = this.safeString(this.input(req.body.img));
            const slug = this.safeString(this.input(req.body.slug));
            const title_seo = this.safeString(this.input(req.body.title_seo));
            const description_seo = this.safeString(this.input(req.body.description_seo));
            const formData = {title,category_id,status
                ,short_description,long_description,img,slug,title_seo,description_seo};
            req.session.blog_add_data = formData;
            
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
              const fileName = 'img_blog/' + fileNameGenerator('img',ext);
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
                              const fileName = 'img_blog/' + fileNameGenerator('img_blog',ext);
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
  
                const resultAdd = await this.model.add(title,category_id,status
                    ,short_description,long_description,price,img,medium_img,slug,title_seo,description_seo);
                if(typeof resultAdd === 'number')
                    return res.redirect(`${this.#url}add/?msg=${resultAdd}`);
                else if(resultAdd?._id)
                {
                    delete req.session.blog_add_data;
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
            const sortFields = ['_id','title','category_id','last_edit_date_time','status'];
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
                const resultDelete =  await this.model.deleteRow(del_id);
                if(resultDelete === 1)
                    return res.redirect(url + `&id=${del_id}&page=${page}&msg=delete_success`);
                else
                    return res.redirect(url + `&page=${page}&msg=delete_error`);
            }

            const pagination = await this.model.pagination(page,sort_field,sort_type,params?.title);
            const data = {
                "title" : ' لیست دوره های حضوری  ',
                "pagination" : pagination,
                "url" : url,
                "route_url" : route_url,
                "delete_url" : delete_url,
                "params" : params,
                "params_query" : params_query,
                "page" : page,
            }
            return res.render(this.templatePath + 'FaceToFaceCourse/index',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async edit(req,res){
        try{
            const page = this.getPage(req);
            const {params,params_query} = this.#getParams(req);
            const backUrl = this.#url + '?' + params_query;
            const editId = this.toObjectId(this.input(req.params.edit_id),true);
            const currentUrl = this.#url + 'edit/'+editId+'?' + params_query;
            if(editId === '')
            {
                return res.redirect(backUrl);
            }
            const rowData = await this.model.getRow(editId);
            if(!rowData)
            {
                return res.redirect(backUrl);
            }
            const row = rowData.toJSON();

            

            if(this.input(req.query.del) == '1')
                {
                    const path = getPath() + 'media/img_faceToFaceCourse' + row.img;
                    await unlink(path);
                    await this.model.deleteImg(editId);
                    return res.redirect(currentUrl);
                }
                if(this.input(req.query.del) == '3')
                    {
                                const path = getPath() + 'media/img_faceToFaceCourse' + row.medium_img;
                                await unlink(path);
                                await this.model.deleteMediumImg(editId);
                                return res.redirect(currentUrl);
                    }
            const categories = await this.model.getCategories();         
               const data = {
                "title" : 'ویرایش دور حضوری',
                "backUrl" : backUrl,
                "categories":categories,
                "row" : row,
                "currentUrl" :currentUrl
            }
            return res.render(this.templatePath + 'FaceToFaceCourse/edit',data);
        }
        catch(e){
            return super.toError(e,req,res);
        }
    }


    async postEdit(req,res){
        try{
            console.log(req.body);
            const page = this.getPage(req);
            const {params,params_query} = this.#getParams(req);
            const editId = this.toObjectId(this.input(req.params.edit_id),true);
            const url = this.#url + `edit/${editId}/?` + params_query + `&page=${page}`;
            const title = this.safeString(this.input(req.body.title));
            const category_id = this.safeString(this.input(req.body.category_id));
            const status = this.safeString(this.input(req.body.status));
            const short_description = this.safeString(this.input(req.body.short_description));
            const long_description = this.input(req.body.long_description);
            const price =this.safeString(this.input(req.body.price));
            const img = this.safeString(this.input(req.body.img));
            const slug = this.safeString(this.input(req.body.slug));
            const title_seo = this.safeString(this.input(req.body.title_seo));
            const description_seo = this.safeString(this.input(req.body.description_seo));
            if(!this.checkCsrfToken(req))
            {
                return res.redirect(`${url}&msg=csrf_token_invalid`);
            }
            const rowData = await this.model.getRow(editId);
            if(!rowData)
            {
                return res.redirect(url);
            }
            const row = rowData.toJSON();
            const result = await this.#validation(req);
            if(!result.isEmpty())
            {
                return res.redirect(`${url}&msg=${result?.errors[0]?.msg}`);
            }          
            else
            {
                

                let img = row?.img ?? '';
                if(img === "" && req?.files?.img)
                {                    
                    if(req.files.img.size <= toByte(1000,'MB'))
                    {
                       const ext = allowImageFileUpload(req.files.img.mimetype);
                       if(ext !== '')
                       {
                            const fileName = 'img_faceTofaceCourse/' + fileNameGenerator('img_faceTofaceCourse',ext);
                            const path = getPath() + 'media/' + fileName;
                            await req.files.img.mv(path);
                            img = fileName;
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

                //UPLOAD Medium IMG 
                let medium_img = row?.medium_img ?? '';
                if(medium_img === "" && req?.files?.medium_img)
                {                    
                    if(req.files.medium_img.size <= toByte(1000,'MB'))
                    {
                       const ext = allowImageFileUpload(req.files.medium_img.mimetype);
                       if(ext !== '')
                       {
                            const fileName = 'img_faceTofaceCourse/' + fileNameGenerator('img_faceTofaceCourse',ext);
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
                const resultSave = await this.model.save(editId,title,category_id,status
                    ,short_description,long_description,price,img,medium_img,slug,title_seo,description_seo);
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
