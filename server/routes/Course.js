const express = require("express")
const router = express.Router()

const {createTag,showAllTags}=require("../controllers/Tags");

router.post("/createTag",createTag);
router.get("/showAllTags",showAllTags);


module.exports = router;