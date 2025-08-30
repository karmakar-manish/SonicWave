import express from "express"
import dotenv from "dotenv"
import fileUpload from "express-fileupload"
import path from "path"
import cors from "cors"
import cookieParser from "cookie-parser"


import userRoutes from "./routes/user.route"
import authRoutes from "./routes/auth.route"
import adminRoutes from "./routes/admin.route"
import songRoutes from "./routes/song.route"
import albumRoutes from "./routes/album.route"
import statRoutes from "./routes/stat.route"

dotenv.config()

// const __dirname = path.resolve()
const app = express()
app.use(cookieParser())

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}))

app.use(express.json())

//under the current folder in backend, create the temporary folder to store image
//this will hold the files before uploading to cloudinary
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname ,"temp"),
    createParentPath: true,  //automatically create the folder before moving the file.
    limits: {
        fileSize: 10*1024*1024  //10MB max file size
    }
})) //middleware for uploading images


app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/songs", songRoutes)
app.use("/api/v1/albums", albumRoutes)
app.use("/api/v1/stats", statRoutes)

// error handling middleware 
app.use((err:any, req:any, res:any, next:any)=>{
    res.status(500).json({message: err.message})
})

const port = process.env.PORT || 4000
app.listen(port, ()=>{
    console.log(`Server is listening on ${port} port.`);
})
