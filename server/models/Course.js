const mongoose  = require("mongoose");
const courseSchema=new mongoose.Schema(
    {
       courseName:{
        type:String,
        required:true,
       },
       courseDescription:{
        type:String,
        required:true,
       },
       instructor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
       },
       whatYouWillLearn:{
        type:String,
       required:true,
       trim:true,
       },
       price:{
        type:Number,
        required:true,
       },
       thumbnail:{
        type:String,
        required:true,
       },
    //    courseContent:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:Section,
    //    }],
       ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReviews",
       }],
       tag:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Tag",
       },
       studentsEnrolled:{
        type:mongoose.Schema.Types.ObjectId,
        
        ref:"User",
       }
});
module.exports=mongoose.model("Course",courseSchema);