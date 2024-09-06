// auth , isStudent , isAdmin
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    //extract jwt token
    const token  = req.body.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    //verify the token
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      // here decode is nothing just a payload which we have stored while creating payload when we are logging in
      console.log(payload);

      req.user = payload;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is Invalid",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while verifying the token",
    });
  }
};

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role != "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Student",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User Role cannot be Verified",
    });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role != "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User Role cannot be Verified",
    });
  }
};











exports.authenticateToken = async (req, res, next) => {
  try{
      //extract token
      // const token = req.cookies.token 
      //                 || req.body.token 
      //                 || req.header("Authorisation").replace("Bearer ", "");
      
      const token = req.header("Authorization").replace("Bearer ", "");

      //if token missing, then return response
      if(!token) {
          return res.status(401).json({
              success:false,
              message:'TOken is missing',
          });
      }

      //verify the token
      try{
          const decode =  jwt.verify(token, process.env.JWT_SECRET);
          req.user = decode;
          console.log("decoding the token: " , req.user.id);
          // console.log(req.user.id);
      }
      catch(err) {
          //verification - issue
          return res.status(401).json({
              success:false,
              message:'token is invalid',
          });
      }
      next();
  }
  catch(error) {  
      return res.status(401).json({
          success:false,
          message:'Something went wrong while validating the token',
      });
  }
}
