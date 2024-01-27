const Tag = require("../models/tagModel");

const tagValidationSchema = {
  name: {
    notEmpty: { errorMessage: "Tag must not be empty" },
    custom: {
      options: async (value) => {
        const tag = await Tag.findOne({$and:[{
          name: { $regex: value, $options: "i" },
        },{name:value}]});
        if (!tag) return true;
        else throw new Error("Tag already present");
      },
    },
  },
};

module.exports = tagValidationSchema;
