const Quiz = require("../models/quizModel");
const { validationResult } = require("express-validator");
const _ = require("lodash");

const quizzesCltr = {};

quizzesCltr.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const body = _.pick(req.body, [
    "title",
    "questions",
  ]);
  try {
    console.log(body.questions);
    const quiz = new Quiz(body);
    await quiz.save();
    await quiz.populate("questions.questionId");
    res.json(quiz);
  } catch (e) {
    res.status(500).json(e);
  }
};

quizzesCltr.list = async (req, res) => {
  try {
    const quiz = await Quiz.find().populate({
      path: "questions.questionId",
      model: "Question",
      populate: { path: "tags.tagId" ,model:"Tag"},
    });
    res.json(quiz);
  } catch (e) {
    res.status(500).json(e);
  }
};

quizzesCltr.edit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const { id } = req.params;
  const body = _.pick(req.body, [
    "title",
    "quizStartDate",
    "quizEndDate",
    "questions",
    "time",
  ]);
  try {
    const quiz = await Quiz.findByIdAndUpdate(id, body, { new: true });
    await quiz.populate("questions");
    res.json(quiz);
  } catch (e) {
    res.status(500).json(e);
  }
};

quizzesCltr.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findByIdAndDelete(id);
    res.json(quiz);
  } catch (e) {
    res.status(500).json(e);
  }
};

// quizzesCltr.singleQuiz=async(req,res)=>{
//   const id=req.params.id
//   try{
//     const quiz=await Quiz.findById(id)
//     res.json(quiz)
//   }
//   catch(e){
//     res.status(404).json(e)
//   }
// }

module.exports = quizzesCltr;
