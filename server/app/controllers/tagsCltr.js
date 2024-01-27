const Tag = require("../models/tagModel");
const { validationResult } = require("express-validator");
const _ = require("lodash");
const { title } = require("../helpers/questionValidationSchema");

const tagsCltr = {};

tagsCltr.create = async (req, res) => {
  const body = _.pick(req.body, ["name"]);
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    const tag = new Tag(body);
    await tag.save();
    res.json(tag);
  } catch (e) {
    res.status(500).json(e);
  }
};

tagsCltr.list = async (req, res) => {
  try {
    const tag = await Tag.find();
    res.json(tag);
  } catch (e) {
    res.status(500).json(e);
  }
};

// tagsCltr.getTagNames=async(req,res)=>{
//   const body=req.body

//     const tt=[]
//    for(tName of body.tagNames){
//     const gg=await Tag.findById(tName)
//     tt.push(gg.name)
//    }
//   //  console.log(tt);
//    res.json(tt)
  
// }

module.exports = tagsCltr;
