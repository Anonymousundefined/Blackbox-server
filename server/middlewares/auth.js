const jwt= require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");
const mailSender = require("../utils/mailSender");



exports.auth = async(req,res,next)=>{
    try{
        //extract token
        console.log("token");
      
        const token = req.body.token || req.cookies.token || req.get("Authorization")?.replace("Bearer ", "");
        console.log(token);
        if(!token){
            return res.status(401).json({
                success : "false",
                message : "tokenn is missing",
            })
        }

        // Verify the token
        try{
            console.log("1");
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("2");
            console.log("decode",decode);
            req.user = decode;
        }
        catch(error){
            // verificationn issue
            console.log(error.name)
            return res.status(401).json({
                success : false,
                message : "token is invalid",
            })
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success : false,
            message : "Something went wrong while validating the token",
        })
    }
}

exports.isStudent=async(req,res,next)=>{
    try
    {
    if(req.user.accountType!="Student")
    {
        return res.status(401).json({success:false,message:"This is a protected route for students only"});
    }
    next();
   }

   catch(error)
   {
    return res.status(500).json({success:false,message:"user role annot be verified,Please try again"});
   }
}

exports.isAdmin=async(req,res,next)=>{
    try
    {
    if(req.user.accountType!="Admin")
    {
        return res.status(401).json({success:false,message:"This is a protected route for Admins only"});
    }
    next();
   }

   catch(error)
   {
    return res.status(500).json({success:false,message:"user role annot be verified,Please try again"});
   }
}

exports.isInstructor=async(req,res,next)=>{
    try
    {
    if(req.user.accountType!="Instructor")
    {
        return res.status(401).json({success:false,message:"This is a protected route for Instructors only"});
    }
    next();
   }

   catch(error)
   {
    return res.status(500).json({success:false,message:"user role annot be verified,Please try again"});
   }
}