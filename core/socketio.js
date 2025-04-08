import {log,getEnv} from './utils.js';
import { createServer } from "http";
import { Server } from "socket.io";
import AdminModel from '../models/admin.js';
import Token from './../core/token.js';
import { Redis } from './../global.js';
import token from './../core/token.js';



export default class SocketIOServer
{

    async init(app){
        try{
            const httpServer = createServer(app);
            this.io = new Server(httpServer,{
                cors: {
                    origin: "*",
                    allowedHeaders: ["my-custom-header"],
                }
            });
            httpServer.listen(3001,async () => {
                log('io bind ok!');
            });

            /*this.io.use(async (socket, next) => {
                try{
                    log('auth middleware is call!');
                    const token = socket.handshake.auth.token;
                    if(token)
                    {
                        const key_access_token = getEnv('ACCESS_TOKEN_PREFIX') + token;
                        const userToken = await Redis.getHash(key_access_token);
                        if(userToken?.user_id)
                        {
                            log('login success by token!');
                            socket.user = userToken;
                            next();
                        }
                        else
                        {
                            const err = new Error("not authorized");
                            return next(err);                      
                        }
                    }
                    else
                    {
                        return next();                  
                    }
                }
                catch(e){
                    log('err');
                    log(e);
                    const err = new Error(e);
                    return next(err);                  
                }
            });
*/
              

            this.io.on('connection',async (socket) => {
                log('new connection');
                
                socket.on("disconnect", async () => {
                    log('user disconnect');
                });
                socket.on('connection_error',this.onError);
                socket.on('authUser',async(data) => await this.authUser(socket,data));  
                

                socket.use(async ([event,...args], next) => {
                    log('auth2 is call!');
                    log(event);
                    if(event === 'authUser')
                    {
                        next();
                    }
                    else
                    {
                        log('check token!');
                        if(args?.token)
                        {
                            const key_access_token = getEnv('ACCESS_TOKEN_PREFIX') + args?.token;
                            const userToken = await Redis.getHash(key_access_token);
                            if(userToken?.user_id)
                            {
                                log('login success by token!');
                                socket.user = userToken;
                                next();
                            }
                            else
                            {
                                socket.disconnect();
                            }
                        }
                        else
                        {
                            socket.disconnect();            
                        }    
                        
                    }
                });                    
                //event test
                socket.on('userSendMessage',async(data) => await this.onRecvMessage(socket,data));
            });
        }
        catch(e){
            log(e);
        }
    }

    async authUser(socket,data){
        try{
            const model = new AdminModel();
            log('authUser is call!');
            log(data);
            const result = await model.login(data.email,data.password);    
            if(result?._id)
            {
                const resultToken = await Token.generate(result?._id,result?.status);
                socket.emit('resultAuthUser',{"is_auth":true,"msg":"login success!"
                ,"token":resultToken?.access_token,"email":result?.email});
            }
            else
            {
                socket.emit('resultAuthUser',{"is_auth":false,"msg":"email or password is incorrect"});
            }
        }
        catch(e){
            socket.emit('resultAuthUser',{"is_auth":false,"msg":e.toString()});
        }
    }

    async onError(error){
        log('error is call!');
        log(error);
    }


    async onRecvMessage(socket,data){
        try{
            log('onRecvMessage is call!');
            log(socket.user);
            log(data);
        }
        catch(e){
        }
    }



}