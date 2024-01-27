const Question=require('../models/questionModel')
const quizValidationSchema = {
  title: {
    notEmpty: { errorMessage: "Quiz title is required" },
  },
  questions: {
    notEmpty:{
      errorMessage:"Question are required"
    },
    isArray: {
      errorMessage: "Mimimum 5 Questions required",
      options: { min: 5 },
      custom:{
        options:(value)=>{
          value.every(async e=>{
            const q=await Question.findById(e)
            if(!q) throw new Error('Invalid Question')
            else return true
          })
        }
      }
    },
  },
};

module.exports = quizValidationSchema;
