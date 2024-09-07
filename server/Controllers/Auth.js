const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
// const { options } = require("../routes/user");
require("dotenv").config();


//login
exports.login = async (req, res) => {
  try {
    //FETCH DATA
    const { email, password } = req.body;

    //validation on email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the details carefully",
      });
    }

    //check existing user
    let user = await User.findOne({ email });

    //if not a register user
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not exist please sign up and then login",
      });
    }

    // if users exist and validated
    //verify password and generate JWT token
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };
    if (await bcrypt.compare(password, user.password)) {
      //password match
      //login and give JWT token
      //create JWT token
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

    //   user.token = token;
    //   user.password = undefined;

    //M-2
    // console.log(user);
    // const oldUser = {...user,token}
    // oldUser.password = undefined;
    // console.log(oldUser);

    //M-3



    user = user.toObject();
    user.token = token;
    console.log(user);
    user.password = undefined;
    console.log(user);

    const options ={
      expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
      //not access on client side
      httpOnly:true,
    }
    res.cookie("token",token,options).status(200).json({
      success:true,
      token,
      user,
      message:"User Logged in successfully"
    })
    
    } 
    else {
      //password does not match
      return res.status(403).json({
        success: false,
        message: "Please enter correct Password",
      });

    }
  } catch (erro) {
    console.log(erro);
    return res.status(500).json({
        success:false,
        message:'Login failed'
    })
  }
};



const Department = require('../models/Department');

const Office = require('../models/Office');

exports.signup = async (req, res) => {
  try {
    console.log("started here")
    const { name, EmployeeId, email, password, gender, Address, office, department, age } = req.body;

    // Check if any required fields are missing
    if (!name || !EmployeeId || !password || !email || !gender || !office || !department || !Address || !age) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Secure password //goodd
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
      });
    }


    // here officeDocume = officeid 
    // and officeid = officeid_id
    // Find the office by its name
    // dont do that , beuacse in front end , 
    // i have chance something in line number 189
    const officeId = await Office.findOne({ name: office });
    console.log("officeId: ",officeId);
    console.log("OfficeId")
    if (!office) {
      return res.status(404).json({
        success: false,
        message: "Office not found",
      });
    }
    // let officeLatitude;
    // let officeLongitude;
    // officeLatitude = officeId.latitude;
    // officeLongitude = officeId.longitude;

    // Find the department by its name and the office ID
    console.log("DepartmentName:",department);
    // console.log("DepartmentName:",name);
    const departmentId = await Department.findOne({ name: department, office: officeId._id });
    console.log("departmentId: ",departmentId);
    if (!departmentId) {
      return res.status(404).json({
        success: false,
        message: "Department not found in the specified office",
      });
    }

    // Create a new user
    const newUser = new User({
      name,
      EmployeeId,
      email,
      password: hashedPassword,
      gender,
      Address,
      office,
      department,
      OfficeId: officeId._id,  // Save the office ID
      departmentId: departmentId._id,  // Save the department ID
      age,
      OfficeLongitude:officeId.longitude,
      OfficeLatitude:officeId.latitude
    });

    console.log("Tryig to save the user");
    const savedUser = await newUser.save();
    console.log("User saved sucessfully");
    console.log(savedUser);

    
     console.log("Trying to save the userId into array of employee in dep");
     console.log("This is departmentid",departmentId);
    departmentId.employees.push(savedUser._id);
    await departmentId.save();


    // i am here 
    // Add the user's ID to the office's employees array
    officeId.employees.push(savedUser._id);
    await officeId.save();

    return res.status(201).json({
      success: true,
      message: `Welcome ${name}! User created successfully.`,
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};







//only to authenticate the token
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
      console.log("Inside authorization of token , the id is this ",req.user.id);
      next();
  }
  catch(error) {  
      return res.status(401).json({
          success:false,
          message:'Something went wrong while validating the token',
      });
  }
}



