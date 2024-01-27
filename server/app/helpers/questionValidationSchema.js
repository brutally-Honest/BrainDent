const Tag=require('../models/tagModel')
const questionValidationSchema = {
  title: {
    notEmpty:{errorMessage:"Question Title must not be empty",bail:true},
    isLength: {
      errorMessage: "Question title must be 10 characters minimum",
      options: { min: 10 },
    },
  },
  type: {
    notEmpty: { errorMessage: "Question type must not be empty" },
  },
  options: {
    isArray: {
      errorMessage: "2 or more options must be provided ",
      options: { min: 2 },
    },
    custom: {
      options: async (value, { req }) => {
        if ( value.length < 2)
          throw new Error("2 or more options must be provided");
        if(!value.every(e=>e.optionText!==''))
        throw new Error("Option must not be empty")
        if(!value.some(e=>e.isCorrect===true))
          throw new Error("Atleast one option must be correct")
        return true;
      },
    },
  },
  tags: {
    optional: {},
    isArray: { errorMessage: "Invalid format " },
  },
};

module.exports = questionValidationSchema;
