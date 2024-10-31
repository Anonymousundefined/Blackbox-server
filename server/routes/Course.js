const express = require("express")
const router = express.Router()

const {createTag,showAllTags}=require("../controllers/Tags");
const {createCourse,getAllCourses} = require("../controllers/Course");
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

router.post("/createCourse", auth,isInstructor,createCourse);
router.post("/createTag",createTag);
router.get("/showAllTags",showAllTags);
router.get("/getAllCourses",getAllCourses);


module.exports = router;