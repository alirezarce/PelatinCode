import nodemailer from 'nodemailer';
import { getEnv,log } from "./utils.js";

export default async function mailSend(to,subject,body,from='')
{
    try{
       const transporter = nodemailer.createTransport({
            host: getEnv('SMTP_HOST'),
            port: getEnv('SMTP_PORT','number'),
            secure: getEnv('SMTP_SECURE','bool'), 
            auth: {
              user: getEnv('SMTP_USERNAME'), 
              pass: getEnv('SMTP_PASSWORD'),
            },
            tls: {rejectUnauthorized: false},
        });

        const info = await transporter.sendMail({
            from: from = (from === '') ? getEnv('SMTP_FROM') : from,
            to: to,
            subject: subject,
            html: body
        });
        //log(info);
    
        return true;
    }
    catch(e){
        log('error email');
        log(e);
        return false;
    }
}
