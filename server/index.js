const express=require("express");
const app=express();
const userRoutes = require("./routes/User");
const courseRoutes = require("./routes/Course");
require("dotenv").config();

const PORT=process.env.PORT ||3000;

app.use(express.json());
const fileupload=require("express-fileupload");
app.use(fileupload({useTempFiles:true,tempFileDir:"/tmp"}));
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/course", courseRoutes);

  
const dbconnect=require("./config/database");
dbconnect();

 const cloudinary=require("./config/cloudinary");
 cloudinary.cloudinaryConnect();

// const Upload=require("./routes/FileUpload");
// app.use('/api/v1/upload',Upload);
app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT,()=> {console.log("conquering Final task");});