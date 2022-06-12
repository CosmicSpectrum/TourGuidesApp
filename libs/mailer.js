const NodeMailer = require('nodemailer');
const generatePassword = require("./codeGenerator");

module.exports = class sendMail{
    static async sendMail(userEmail){
        try{
            const tansporter =  await this.#createTransport();
            const otp = generatePassword(6)
            const mailOptions = this.#getMailOptions(userEmail, otp);

            const result =  tansporter.sendMail(mailOptions).then(res=>{
                return {status: true, otp};
            }).catch(err=>{
                throw err;
            })

            return result
        }catch(err){
            throw err;
        }
    }

    static async #createTransport(){
        return NodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL,
                pass: process.env.MAIL_PASSWORD
            }
        })
    }

    static #getMailOptions(userEmail, otp){
        return {
            from: `"איפוס סיסמה" <${process.env.MAIL}>`,
            to: userEmail,
            subject: 'אפס סיסמך באפליקציית משדר למורי דרך',
            text: 
            `סיסמה חד פעמית אשר סופקה לך לאיפוס סיסמתך הינה: ${otp}
            לאיפוס הסיסמה יש להיכנס לקישור הבא: ${process.env.APP_BASE_DOMAIN}/validateOtp?email=${userEmail}
            `
        }
    }
}