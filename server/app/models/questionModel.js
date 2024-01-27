const mongoose=require("mongoose")
const {Schema,model}=mongoose

const questionSchema=new Schema({
    title:String,
    type:{
        type:String,
        enum:["scq","mcq"]
    },
    options:[{optionText:String,isCorrect:Boolean}],
    tags:[{tagId:{ref:"Tag",type:Schema.Types.ObjectId}}],
    score:{
        type:Number,
        default:1
    }
 
},{timestamps:true})

const Question=model("Question",questionSchema)

module.exports=Question