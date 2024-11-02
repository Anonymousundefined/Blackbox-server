const express = require("express")
const router = express.Router()

const {createCategory,showAllCategories}=require("../controllers/Categories");
const {createCourse,getAllCourses} = require("../controllers/Course");
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");
const {createSection,updateSection,deleteSection,} = require("../controllers/Section")

router.post("/createCourse", auth,isInstructor,createCourse);
router.post("/createCategory",createCategory);
router.get("/showAllCategories",showAllCategories);
router.get("/getAllCourses",getAllCourses);
router.post("/addSection", auth, isInstructor, createSection)
router.post("/updateSection", auth, isInstructor, updateSection)
router.post("/deleteSection", auth, isInstructor, deleteSection)

module.exports = router;