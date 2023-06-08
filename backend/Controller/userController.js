const asyncHandler = require('express-async-handler')
const { nextTick } = require('process')
const User = require('../Models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })

}

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body

    //validation

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill all required field")
    }
    if (password.length < 6) {
        res.status(400)
        throw new Error("Password must be greater than 6")
    }

    //check if email is unique

    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(400)
        throw new Error("Email already exist")
    }

    //create new user
    const user = await User.create(
        {
            name,
            email,
            password,
            phone
        }
    )
    const token = generateToken(user._id);

    //send cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        secure: true
    })

    if (user) {
        const { id, name, email, password, phone } = user
        res.status(201).json({
            id, name, email, phone, token
        })

    } else {
        res.status(400);
        throw new Error("Invalid user data")
    }

})

//Login user

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    //validate request
    if (!email || !password) {
        res.status(200);
        throw new Error("Invalid user data");
    }

    //validate user
    const user = await User.findOne({ email })

    if (!user) {
        res.status(401);
        throw new Error('User does not exist')
    }

    

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    const token = generateToken(user._id);

    //send cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        secure: true
    })

    if (user && passwordIsCorrect) {
        const { id, name, email, phone } = user
        res.status(200).json({
            id, name, email, phone,token
        })

    }else {
        res.status(200);
        throw new Error("Invalid user data");
    }

})

const logOut = asyncHandler(async (req,res) => {
    res.cookie("token","", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    })

    res.status(200).json({message:"Successfully logged out"})
})

const getUser = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { id, name, email, phone } = user
        res.status(200).json({
            id, name, email, phone,
        })

    } else{
        res.status(400)
        throw new Error ("Invalid user data")

    }

})

const loginStatus = asyncHandler(async(req,res) =>{
    const token = req.cookies.token;
    if(!token){
        return res.json(false)
    }

    const verified = jwt.verify(token,process.env.JWT_SECRET)
    if(verified){
        return res.json(true)
    }
    return res.json(false)
})

const updateUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        const { id, name, email, phone,bio } = user;
        user.email = email;
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;

        const updatedUser = await user.save()
        res.status(200).json({
            id : updatedUser._id, 
            name : updatedUser.name, 
            email: updatedUser.email, 
            phone : updatedUser.phone ,
            

        })


    } else {
        res.status(400)
        throw new Error("Cant update")
    }

})

const changePassword = asyncHandler( async (req,res) => {
    const user = await User.findById(req.user._id)
    if(!user){
        res.status(400)
        throw new Error("User not found")
    }
    const {oldPwd,newPwd} = req.body

    if(!oldPwd || !newPwd) {
        res.status(400)
        throw new Error("Field cannot be empty")
    }
    const passwordIsCorrect = await bcrypt.compare(oldPwd, user.password);
    if(passwordIsCorrect) {
        user.password = newPwd;
        await user.save()

        res.status(200).send("Password changed successfully")
    } else {
        res.status(400);
        throw new Error("Please add old and new password")
    }
})

const forgotPassword = asyncHandler( async(req,res) => {
    res.send("Forgot password")

})


module.exports = {
    registerUser,
    loginUser,
    logOut,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword
};