const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    const tokenData = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = tokenData;
    next();
  } catch (e) {
    res.status(401).json(e);
  }
  
};

const authorizeUser=async(req,res,next)=>{

if(req.user.role==="admin")  next()
else res.json({errors:"Access prohibited"})


}

module.exports = { authenticateUser,authorizeUser };
