const { validationResult, body } = require("express-validator");
const _ = require("lodash");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const usersCltr = {};

usersCltr.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  if (req.body.role == "admin") req.body.role = "user";
  try {
    const userCount = await User.countDocuments();
    if (userCount == 0) req.body.role = "admin"; // Set 1st User as admin

    const body = _.pick(req.body, ["email", "username", "password", "role"]);
    const user = new User(body);
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(body.password, salt);
    user.password = hashedPassword;
    await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json(e);
  }
};

usersCltr.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(404)
        .json({ errors: [{ msg: "Invalid email/password" }] });
    const compare = await bcryptjs.compare(req.body.password, user.password);
    if (!compare)
      return res
        .status(404)
        .json({ errors: [{ msg: "Invalid email/password" }] });
    // console.log("After password comparision",compare);
    const tokenData = { id: user._id, role: user.role };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const msg = "Logged In";
    res.json(token);
  } catch (e) {
    res.status(500).json(e);
  }
};

usersCltr.account = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select({"username":1,"email":1,"role":1});
    res.json(user);
  } catch (e) {
    res.status(500).json(e);
  }
};
module.exports = usersCltr;
