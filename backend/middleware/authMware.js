const asyncHandler = require("express-async-handler");
const  jwt  = require("jsonwebtoken");
const User = require('../Models/userModel')

const protect = asyncHandler(async (req,res,next) => {
    try {
        const token = req.cookies.token
        if(!token) {
            res.status(401)
            throw new Error("Not authorized, please login")
        }

        const verified = jwt.verify(token,process.env.JWT_SECRET)
        //get user id from token
        const user = await User.findById(verified.id).select('-password');

        if(!user){
            res.status(401)
            throw new ("User not found")
        }
        req.user = user
        next()
    } catch (err) {
        res.status(401);
        throw new Error("Not Authorized, please Login");
        
    }
})

module.exports = protect ;