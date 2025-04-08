import {log,getEnv,csrfToken,renderID,number_format} from './core/utils.js';
import express from 'express';
import nunjucks from 'nunjucks';
import translate from './core/translate.js';
import {Amqp, MongoDB, Redis} from './global.js';
import * as templateHelper from './core/TemplateHelper.js';
import TemplateReqMiddleware from './middlewares/template-req.js';
import FileUploadMiddleware from './middlewares/fileupload.js';
import SessionMiddleware from './middlewares/session.js';
import datetime from './core/datetime.js';
import Error404Controller from './controllers/Error404Controller.js';
import Error500Controller from './controllers/Error500Controller.js';
import serveIndex from 'serve-index';


class Application
{
    #app = null;
    #templateEngine = null;

    async #initExpress()
    {
        try{
            this.#app = express();
	    this.#app.set('trust proxy', 1); 	
            this.#app.disable('x-powered-by');
            this.#app.use(express.static('assets'));
            //this.#app.use('/.well-known', express.static('.well-known'), serveIndex('.well-known'));
            this.#app.use(express.static('media'));
            this.#app.use(express.urlencoded({extended:true,limit:'10mb'}));
            this.#app.use(express.json({limit:'10mb'}));
            this.#app.use(new SessionMiddleware().handle);
            this.#app.use(new FileUploadMiddleware().handle);
            this.#app.use(new TemplateReqMiddleware().handle);
            this.#initTemplateEngine();
        }
        catch(e){
            log(`Error on : initExpress ${e.toString()}`);
        }   
    }

    async #initRoute()
    {
        try{
            const route = await import('./routes/route.js');
            this.#app.use('/',route.default);
            this.#app.use(new Error404Controller().handle);
            this.#app.use(new Error500Controller().handle);
        }
        catch(e){
            log(`Error on : initRoute ${e.toString()}`);
        }
    }


    #initTemplateEngine(){
        try{
            const templateDir = 'templates/'; 
            this.#templateEngine = nunjucks.configure(templateDir,{
                autoescape : true,
                express : this.#app,
                noCache : false,
            });
            this.#app.set('view engine', 'html');
            this.#templateEngine.addGlobal('t',translate.t);
            this.#templateEngine.addGlobal('getEnv',getEnv);
            this.#templateEngine.addGlobal('asset_lang_url',(path = '') => { 
                return getEnv('ASSET_DIRECTORY') + '/lang/' + getEnv('APP_LANG') + '/' + path
            });
            this.#templateEngine.addGlobal('FRONTEND_URL',getEnv('FRONTEND_URL'));
            this.#templateEngine.addGlobal('BACKEND_URL',getEnv('BACKEND_URL'));
            const backendTemplate = 'backend/'+getEnv('BACKEND_TEMPLATE')+'/';
            this.#templateEngine.addGlobal('BACKEND_TEMPLATE',backendTemplate);    
            const frontendTemplate = 'frontend/'+getEnv('FRONTEND_TEMPLATE')+'/';
            this.#templateEngine.addGlobal('FRONTEND_TEMPLATE',frontendTemplate);    
            this.#templateEngine.addGlobal('backend_asset_url',(path = '')=>{ return 'backend/' + getEnv('BACKEND_ASSET_DIRECTORY') + '/' + path; });
            this.#templateEngine.addGlobal('frontend_asset_url',(path = '')=>{ return 'frontend/' + getEnv('FRONTEND_ASSET_DIRECTORY') + '/' + path; });
            this.#templateEngine.addGlobal('csrf_token',() => { 
                return csrfToken(this.#app.get('req')); 
            });

            this.#templateEngine.addExtension('alertDangerExtension',new templateHelper.alertDangerExtension());
            this.#templateEngine.addExtension('alertSuccessExtension',new templateHelper.alertSuccessExtension());
            this.#templateEngine.addExtension('menuItemExtension',new templateHelper.menuItemExtension());
            this.#templateEngine.addExtension('renderPaginationExtension',new templateHelper.renderPaginationExtension());
            this.#templateEngine.addExtension('renderPaginationExtensionFront',new templateHelper.renderPaginationExtensionFront());
            this.#templateEngine.addExtension('renderFieldExtension',new templateHelper.renderFieldExtension());
            this.#templateEngine.addFilter('asyncCallFunction', async(...args) => {
                const callback = args.pop();
                try{
                    const functionName = args[1].function;
                    const params = args[1].params;
                    const data = await functionName.apply(null,params);  
                    callback(null, data);
                }
                catch(e){
                    callback(null,e.toString());
                }
            }, true);            
            this.#templateEngine.addGlobal('renderID',(totalRows) => { 
                return renderID(this.#app.get('req'),totalRows); 
            });
            this.#templateEngine.addGlobal('toJalaali',(str,format = 'jYYYY-jMM-jDD HH:mm:ss') => { 
                return datetime.toJalaali(str,format);
            });
            this.#templateEngine.addGlobal('toGregorian',(str,format = 'YYYY-MM-DD HH:mm:ss') => { 
                return datetime.toGregorian(str,format);
            });
            this.#templateEngine.addGlobal('number_format',(str) => { 
                return number_format(str);
            });
        }
        catch(e){
            log(`Error on : initTemplateEngine ${e.toString()}`);
        }
    }


    async #init(){
        const redisStatus =  await Redis.connect(getEnv('REDIS_URI'));
        if(!redisStatus)
        {
            log('Redis Can not Connect');
            process.exit(-1);
        }

        const amqpStatus =  await Amqp.connectToRabbitMQ();
        //log(amqpStatus)
        if(amqpStatus==false)
        {
            log('Amqp Can not Connect');
            process.exit(-1);
        }
        
        const mongodbStatus = await MongoDB.connect(getEnv('MONGODB_URI'));
        if(!mongodbStatus)
        {
            log(`monogdb Can not Connect!`);
            process.exit(-1);
        }

        await this.#initExpress();
        await this.#initRoute();
    }

    async run()
    {
        try{
            log(`Application is run!`);
            await this.#init();
            const PORT = getEnv('PORT','number');
            this.#app.listen(PORT,async() => {
                log(`app listening on port ${PORT}`);
            });    
        }
        catch(e){
            log(`Error on : run ${e.toString()}`);
        }
    }

}


export default Application;
