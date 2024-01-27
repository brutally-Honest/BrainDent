const User = require("../models/userModel");

const usernameSchema = {
  notEmpty: { errorMessage: "Username is required" },
};
const emailSchema = {
  isEmail: { errorMessage: "Email is invalid/empty" },
  custom: {
    options: async (value) => {
      const user = await User.findOne({ email: value });
      if (user) throw new Error("Email already exists");
      else return true;
    },
  },
};
const passwordSchema = {
  isStrongPassword: {
    errorMessage:
      "Password should be minimum 8 characters long with atleast 1 lowercase letter,1 uppercase letter,1 number and 1 symbol",
    options: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
  }
};

const userLoginSchema = {
  email: emailSchema.isEmail,
  password: passwordSchema,
};

const userRegisterSchema = {
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
};

module.exports = { userLoginSchema, userRegisterSchema };
