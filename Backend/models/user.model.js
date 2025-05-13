const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userschema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3, 'First name must be at least 3 characters long'],
        },
        lastname:{
            type:String,
           
            minlength:[3, 'last name must be at least 3 characters long'],
        }
    },
        email:{
            type:String,
            required:true,
            unique:true,
           minlength:[5, 'email must be at least 3 characters long'],
        },
        password:{
            type:String,
            required:true,
           select:false,
        },
        socketId:{
            type:String,
          
        },
    
})


userschema.methods.generateAuthToken =  function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}
userschema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
userschema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('User', userschema);
module.exports = userModel;