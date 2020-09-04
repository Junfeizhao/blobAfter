
'use strict';
const nodemailer = require('nodemailer');
module.exports= function maile(receiver,code){  //{receiver,title,context,html}

    nodemailer.createTestAccount((err, account) => {
        var auth;
        var host;
        var from;
        console.log(receiver,22)
        if(receiver.indexOf("@163")!=-1){
            console.log(8888888)
           auth={
            user: '13298333864@163.com', 
            pass: 'RJPHKJZSZVQRKDIL'
           };
           host="smtp.163.com";
           from=`13298333864@163.com`
        }else if(receiver.indexOf("@qq")!=-1){
            console.log(99999)
            auth={
                user: '1505811266@qq.com', 
                pass: 'qoohlpywcawmhdca'         
            };
            host='smtp.qq.com';
            from=`等什么君<1505811266@qq.com>`;
        }
        
        let transporter = nodemailer.createTransport({
            host: host,
            port: 465,
            secure: true, 
            auth: auth
        });
    
        let mailOptions ={
            from: from, 
            to: receiver, 
            subject: '邮箱验证',  
            html: `您的验证码为:<b>${code}</b>,请在一分钟内完成验证`
        };
    
     
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return error;
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
           
        })
    });


    
}

