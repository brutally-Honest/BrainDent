const mongoose=require("mongoose")
const {Schema,model}=mongoose

const userSchema=new Schema({
    username:String,
    email:String,
    password:String,
    role:{
        enum:["admin","user"],
        default:"user",
        type:String
    },
})

const User=model("User",userSchema)

module.exports=User