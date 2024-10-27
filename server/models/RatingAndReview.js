const mongoose  = require("mongoose");

const ratingAndReviewSchema=new mongoose.Schema(
    {
        gender:{
            type:String,
        },
        dateOfBirth:{
            type:String,
        },
        about:{
            type:String,
            trim:true,
        },
        contactNumber:{
            type:String,
            trim:true,
           
        },
});
module.exports=mongoose.model("RatingAndReview",ratingAndReviewSchema);