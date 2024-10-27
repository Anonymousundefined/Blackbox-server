const express = require("express")
const router = express.Router()

const {login,signup,sendOTP,changePassword,} = require("../controllers/Auth")
const {resetPasswordToken,resetPassword, } = require("../controllers/ResetPassword")

const {auth,isStudent, isInstructor,isAdmin }= require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);
router.post("/sendOTP", sendOTP);


router.get("/test",auth,(req,res)=>{res.json({success:true,message:"ITs just authentic test route ", });});
router.get("/student",auth,isStudent,(req,res)=>{res.json({success:true,message:"Welcome to student route", });});
router.get("/admin",auth,isAdmin,(req,res)=>{res.json({success:true,message:"Welcome to student route", });});
router.get("/instructor",auth,isInstructor,(req,res)=>{res.json({success:true,message:"Welcome to student route", });});


router.post("/changepassword",auth,changePassword);

router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);


module.exports = router;