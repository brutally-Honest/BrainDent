const { validationResult } = require("express-validator");
const Question = require("../models/questionModel");
const _ = require("lodash");

const questionsCltr = {};

questionsCltr.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const body = _.pick(req.body, ["title", "type", "options", "tags"]);
  try {
    const question = new Question(body);
    await question.save();
    await question.populate({path:"tags.tagId",model:"Tag"})
    res.json(question);
  } catch (e) {
    res.status(500).json(e);
  }
};
questionsCltr.list = async (req, res) => {
  try {
    const question = await Question.find().sort({createdAt: "desc"}).populate({path:"tags.tagId",model:"Tag"});
    res.json(question);
  } catch (e) {
    res.status(500).json(e);
  }
};
questionsCltr.show = async (req, res) => {
  const id = req.params.id;
  try {
    const question = await Question.findById(id);
    res.json(question);
  } catch (e) {
    res.status(500).json(e);
  }
};
questionsCltr.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const question = await Question.findByIdAndDelete(id);
    res.json(question);
  } catch (e) {
    res.status(500).json(e);
  }
};
questionsCltr.edit=async(req,res)=>{
    const id=req.params.id
    const body=_.pick(req.body,["title","type","options","tags","score"])
    try{
        const question=await Question.findByIdAndUpdate(id,body,{new:true})
        res.json(question)
    }
    catch(e){
        res.status(500).json(e)
    }
}
module.exports = questionsCltr;
