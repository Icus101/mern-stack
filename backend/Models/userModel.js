const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({

    name : {
        type : String,
        required : [true,"Enter your name"]
    },
    email : {
        type : String,
        required : [true,"Enter your email"],
        unique : true,
        trim : true,
        match : [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Please enter a valid email'

        ]
    },

    password : {
        type : String,
        required : [true,"Please enter your password"],
        minLength : [6 , 'Password must be greater than 6'],
        // maxLength : [32 , 'Password must be less than 32']
    },

    bio : {
        type : String,
        default : 'bio',
        maxLength : [250 , 'Bio must be greater than 250']

    },
    
    photo : {
        type : String,
        required : [false,'Please enter a photo'],
        
    },
    phone : {
        type : String,
        default : '+234'

    }

},{
    timestamps : true
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next()
    }
    //encrypt password

    const salt = await bcrypt.genSalt(10)
    const hashedPwd = await bcrypt.hash(this.password,salt)
    this.password = hashedPwd;
    next()

})

const User = mongoose.model("User", userSchema)

module.exports = User;