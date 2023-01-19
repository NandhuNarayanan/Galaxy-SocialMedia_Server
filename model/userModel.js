const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email:String,
    password:String,
    phone:Number,
    profilePicture:{type:String},
    bio:String,
    location:String,
    gender:String,
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
        
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }],
    savedPost:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'posts'
    }],
    notification:[{type:Object}],
    isBlocked: { type: Boolean, default: false },
    refreshToken: [String],

},{ timestamps: true })

const userModel = mongoose.model('users', userSchema)

module.exports = userModel
