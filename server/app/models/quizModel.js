const mongoose=require('mongoose')
const {Schema,model}=mongoose

const quizSchema=new Schema({
    title:String,
    questions:[{questionId:{ref :"Question",type:Schema.Types.ObjectId}}],
})

const Quiz=model('Quiz',quizSchema)

module.exports=Quiz