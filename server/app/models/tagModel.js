const mongoose=require("mongoose")
const {Schema,model}=mongoose

const tagSchema=new Schema({
    name:String,
})

const Tag=model("Tag",tagSchema)

module.exports=Tag