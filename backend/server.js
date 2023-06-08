const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const cors = require('cors'); 
const userRoute = require('./Routes/userRoutes')
const errorHandler = require("./middleware/errorMiddle")
const cookieParser = require("cookie-parser")

const app = express()

const port = process.env.PORT || 6000

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())

//route middleware
app.use("/api/users",userRoute)
//routes

app.get("/", (req,res)=>{
    res.send("Homepage");
});

app.use(errorHandler)

// CONNECT TO DB

mongoose.connect(process.env.MONGO_URI).then(
 ()=>{
    app.listen(port, ()=>{
        console.log(`Server running on port ${port}`);
    })
 }
).catch((error) => {console.log(error);})