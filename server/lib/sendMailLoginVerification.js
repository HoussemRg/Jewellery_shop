const nodemailer=require('nodemailer')

const sendLoginMail = async (userEmail,subject,htmlTemplate) =>{
    try{       
        const transporter=nodemailer.createTransport({
            service:"Gmail",
            auth:{
                user:process.env.APP_EMAIL_ADRESS,
                pass:process.env.APP_EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    
        const mailOptions={
            from:process.env.APP_EMAIL_ADRESS,
            to:userEmail,
            subject:subject,
            html:htmlTemplate 
        }
     
        const info=await transporter.sendMail(mailOptions);
        console.log("Email sent" + info.response)
    }catch(err){
        console.log(err);
        throw new Error('internal server error (nodemailer)')
    }
}

module.exports={sendLoginMail};