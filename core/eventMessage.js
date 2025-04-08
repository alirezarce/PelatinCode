import {log} from './utils.js';
import {Emitter} from './../global.js';

Emitter.on('login',async (data)=>{
    log('login event is call');
    log(data);
});

Emitter.on('register',async (data)=>{
    log('register event is call');
    log(data);
});