const express = require("express");
const protect = require("../middleware/authMware")

const router = express.Router()



const {registerUser, loginUser,logOut, getUser,loginStatus,updateUser,changePassword,forgotPassword} = require('../Controller/userController')

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/logout',logOut)
router.get('/getUser',protect,getUser)
router.get('/loginStatus',loginStatus)
router.patch('/updateUser',protect,updateUser)
router.patch('/changePassword',protect,changePassword)
router.post('/forgotPassword',protect,forgotPassword)

module.exports =  router;