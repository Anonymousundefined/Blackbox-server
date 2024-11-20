const User=require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator=require("otp-generator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const {passwordUpdated} = require("../mail/passwordUpdated");



exports.sendOTP= async(req,res)=>{
try
{
  const {email}=req.body;
  const checkUserPresent=await User.findOne({email});
  if(checkUserPresent)
  {
    return res.status(401).json({succuess:false,message:"User already registered"});
  }
  let otp=otpGenerator.generate(6,{upperCaseAlphabet:false,lowerCaseAlphabet:false,specialChars:false});
  console.log("OTP Generated is:",otp);
  const result=await OTP.findOne({otp:otp});

  while (result)
  {
  otp=otpGenerator.generate(6,{upperCaseAlphabet:false,lowerCaseAlphabet:false,specialChars:false});  
  result=await OTP.findOne({otp:otp}); 
  }

  const otpPayload={otp,email};
  console.log(otpPayload);
  const otpBody=await OTP.create(otpPayload);

return res.status(200).json({success:true,message:"OTP sent successfully",otp});
 
}
catch(error)
{
 console.log(error);
 return res.status(500).json({success:false,message:error.message});
}

}

exports.signup=async(req,res)=>{
    try
    {
      const{firstName,lastName,email,password,confirmPassword,contactNumber,accountType,otp}=req.body;
      console.log(otp);
      if(!firstName || !lastName || !email || !password ||!confirmPassword || !otp)
      {
        return res.status(403).json({success:false,message:"Incomplete credentials"});
      }
      console.log("q1");
      if(password!=confirmPassword)
      {
        return res.status(400).json({success:false,message:"Password and confirm Password does not match"});
      }
      console.log("q2");
      const existingUser=await User.findOne({email});
      if(existingUser)
      {
        return res.status(400).json({success:false,message:"User already registered"});
      }  
      const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(-1);
      console.log(recentOtp);
      
      if(recentOtp.length==0)
      {
        return res.status(400).json({success:false,message:"OTP NOT FOUND"}); 
      }
      console.log("recent otp is",recentOtp[0].otp);
      console.log("otp",otp);
      if(recentOtp[0].otp!=otp)
      {
        return res.status(400).json({success:false,message:"INVALID OTP"});
      }
     console.log("q3");
      const hashedPassword=await bcrypt.hash(password,10);
      console.log("q4");
      const profileDetails=await Profile.create({gender:null,dateOfBirth:null,about:null,contactNumber:null});
      if (!profileDetails) {
        console.log("Error: Profile creation failed.");
        return res
          .status(500)
          .json({ success: false, message: "Profile creation failed" });
      }
      
      console.log("Profile ID:", profileDetails._id);
      const user= await User.create({firstName,lastName,email,contactNumber,
                  password:hashedPassword,accountType,
                  image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,  
      });
      return res.status(200).json({success:true,message:"User Registered successfully",user}); 

    } 
    catch(error)
    {
    console.log(error);
    return res.status(500).json({success:false,message:"User cannot be registered .Try it again"});
    }
}

exports.login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email || !password)
        {
            return res.status(403).json({success:false,message:"Incomplete credentials"});
        }
        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(401).json({success:false,message:"User is not regsitered ,Please signup first"});
        }
        console.log(password);
        console.log(user.password);
        if( await bcrypt.compare(password,user.password))
        {
            const payload={id:user._id,accountType:user.accountType,email:user.email};
            const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2h"});
            user.token=token;
            user.password=undefined;
            const options={expires:new Date(Date.now()+3*24*60*60*1000),httpOnly:true};
            res.cookie("anmolcookie",token,options).status(200).json({success:true,token,user,message:"user logged in successfully"}); 
        }
        else
        {
            return res.status(401).json({success:false,message:"Password is Incorrect"});
        }
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({success: false,message: `Login Failure Please Try Again`,});
    }
}

exports.changePassword = async (req,res) => {
  try {
  
    const userDetails = await User.findById(req.user.id)
    console.log(userDetails);
    const {oldPassword, newPassword} = req.body;
    console.log(oldPassword);
    console.log(userDetails.password);
  
    if(! await bcrypt.compare(oldPassword,userDetails.password)){
     
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

   
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

  
    try {
			const emailResponse = await mailSender(
        updatedUserDetails.email,
        'Password Update Confirmation', // Subject
        passwordUpdated(
            updatedUserDetails.email,
            `${updatedUserDetails.firstName} ${updatedUserDetails.lastName}` // Pass only the name
        )
    );
			console.log("Email sent successfully:", emailResponse.response);
		}
    catch (error)
     {
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } 
  catch (error) 
  {
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}