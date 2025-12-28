const mongoose = require("mongoose");
// mongoose.connect("")  db link

const userSchema = new mongoose.Schema({
    username: {type: String,unique: true},
    email: {type: String,unique: true},
    firstName : String,
    lastName: String,
    password: String
})

const userModel = mongoose.model('users',userSchema)

module.exports = {
    userModel
}