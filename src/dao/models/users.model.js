const mongoose= require('mongoose')
const userPaginate = require('mongoose-paginate-v2')

const userSchema= new mongoose.Schema({
    first_name:{
        type:String,
        unique:false,
        required:true
    },
    last_name:{
        type:String,
        unique:false,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    age:{
        type:Number,
        unique:false,
        required:true,
        default:18
    },
    password:{
        type:String,
        unique:false,
        required:true,
        default:123456
    },
    rol:{
        type:String,
        required:true,
        default:'User'
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User

