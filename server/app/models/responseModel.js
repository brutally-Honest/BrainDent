const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const responseModelSchema = new Schema({
  quiz: {
    ref: "Quiz",
    type: Schema.Types.ObjectId,
  },
  attempts:Number,
  user: {
    ref: "User",
    type: Schema.Types.ObjectId,
  },
  score: [Number],
  total:Number
});

const Response = model("Response", responseModelSchema);

module.exports = Response;
