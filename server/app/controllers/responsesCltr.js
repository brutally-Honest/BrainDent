const Response = require("../models/responseModel");
const Quiz = require("../models/quizModel");
const {} = require("express-validator");
const responsesCltr = {};

responsesCltr.calculate = async (req, res) => {
  const body = req.body.answers;
  const id = req.params.id;

  try {
    const quiz = await Quiz.findById(id).populate("questions.questionId");
    const correctAnswers = quiz.questions.map((q) => {
      const filter = q.questionId.options.filter((opt) => opt.isCorrect);
      if (filter.length === 1) return filter[0];
      else return filter;
    });

    const check = correctAnswers.map((e, i) => {
      if (!Array.isArray(body[i])) {
        if (String(e._id) === body[i]) {
          return 1;
        } else return 0;
      } else {
        const mcqResult = e.every((mcq, mi) => {
          if (body[i].includes(String(mcq._id))) {
            return true;
          } else return false;
        });
        if (mcqResult) {
          return 1;
        } else {
          return 0;
        }
      }
    });

    const score = check.reduce((acc, cv) => acc + cv);
    const tries=await Response.findOne({quiz:id,user:req.user.id})
    if(!tries)
    {console.log('First time');
      const quizResponse = new Response({
      attempts:1,
      score:[score],
      user: req.user.id,
      quiz:quiz._id,
      total:quiz.questions.length
    });
    await quizResponse.save()
    await quizResponse.populate('quiz')
    res.json({
      msg: `You scored ${score} out of ${quiz.questions.length} `,
      data: quizResponse,
    });}
    else {
      console.log('Not first time');
      if(tries.attempts===3) return res.status(400).json('You Can only attempt 3 Times')
      tries.attempts+=1;
      tries.score=[...tries.score,score]
      await tries.save()
      await tries.populate('quiz')
      res.json({
        msg: `You scored ${score} out of ${quiz.questions.length} `,
        data: tries,
      });
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

responsesCltr.all=async(req,res)=>{
  try{
    const results=await Response.find({user:req.user.id}).populate('quiz')
    res.json(results)
  }catch(e){
    res.status(500).json(e)
  }
}

module.exports = responsesCltr;
