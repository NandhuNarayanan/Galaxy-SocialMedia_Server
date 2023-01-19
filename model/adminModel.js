const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const adminSchema = mongoose.Schema({
    email:String,
    password:String,
    refreshToken: [String],

},{ timestamps: true })

const adminModel = mongoose.model('admins', adminSchema)

module.exports = adminModel