const mongoose  = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/emailVerificationTemplate");

const otpSchema=new mongoose.Schema(
    {
       email: {
        type:String,
        required:true,
       },
       otp:{
        type:String, 
        required:true, 
    },    
     createdAt:{
        type:Date,
        default:Date.now(),
        expires:50*60,
    }     
    }); 

async function sendVerificationEmail(email,otp)
{
    try
    {
        const mailResponse = await mailSender(email,
			"Verification Email",
			emailTemplate(otp))
        console.log("Email sent Successfully: ", mailResponse.response);
        
    }
    catch(error)
    {
        console.log("Error while sending Email",error);
    }
}

otpSchema.pre("save",async function(next){
  await sendVerificationEmail(this.email,this.otp);
  next();
})
module.exports=mongoose.model("OTP",otpSchema);