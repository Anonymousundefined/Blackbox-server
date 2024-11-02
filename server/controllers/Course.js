const {response} = require("express");
const Course = require("../models/Course");
const Tag = require("../models/Category");
const User  = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

exports.createCourse = async(req,res) =>{
    try{
       
        const{courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;
        const thumbnail = req.files.thumbnailImage;

        if(!courseName|| !courseDescription|| !whatYouWillLearn|| !price|| !tag)
        {
            return res.status(400).json({ success : false,message : "All fields are required",})
        }

        
        const userId = req.user.id; 
        console.log("userid",userId)
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details :" ,instructorDetails);
        
       
        if(!instructorDetails)
        {
            return res.status(404).json({success : false,message : "Instrcutor details not found", })
        }

       
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails)
        {
            return res.status(404).json({success : false,message : "Tag details not found",})
        }

     
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

   
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor : instructorDetails._id,
            whatYouWillLearn : whatYouWillLearn,
            price,
            
            thumbnail : thumbnailImage.secure_url,
        })

        await User.findByIdAndUpdate(
            userId,  
            {
                $push: {
                    courses: newCourse._id
                }
            },
            { new: true }
        );
       await Tag.findByIdAndUpdate(
       tag,  
    {
        $push: { course: newCourse._id }
    },
    { new: true }
);

      
        return res.status(200).json({success : true,message : "Course created successfully",})
    }
    catch(error){
        console.error(error);
        return res.status(500).json({success : false,message : "Failed to create a course",error : error.message,})
    }
}


exports.getAllCourses = async(req,res)=>{
    try{
        const allCourses = await Course.find({}, {courseName:true,
                                                    price : true,
                                                    thumbnail : true,
                                                    instructor : true,
                                                    ratingAndReviews : true,
                                                    studentsEnrolled : true,})
                                                    .populate("instructor")
                                                    .exec()
        return res.status(200).json({
            success : true,
            message : "Data for all courses fetched successfully",
            data : allCourses,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Cannot show course data",
            error : error.message,
        })
    }
}

// //getCourseDetails ka handler fucntion
// exports.getCourseDetails = async(req,res)=>{
//     try{
//         //get Id
//         const {courseId} = req.body;
//         //find course details 
//         const courseDetails = await Course.find(
//                                     {_id : courseId})
//                                     .populate(
//                                         {
//                                             path : "instructor",
//                                             populate :{
//                                                 path : "additionalDetails"
//                                             }
//                                         }
//                                     )
//                                     .populate("category")
//                                     .populate("ratingAndReview")
//                                     .populate(
//                                         {
//                                             path : "courseContent",
//                                             populate : {
//                                                 path : "subSection",
//                                             }
//                                         }
//                                     )
//                                     .exec();
//         //validation
//         if(!courseDetails){
//             return res.status(400).json({
//                 success : false,
//                 message : `Could not find the course with ${courseId}`
//             })
//         }
//         return res.status(200).json({
//             success : true,
//             message : "Course details fetched successfully",
//             data : CourseDetails,
//         })                            
//     }
//     catch{
//          console.log(error);
//          return res.status(500).json({
//             success : false,
//             message  :error.message,
//          })
//     }
// }