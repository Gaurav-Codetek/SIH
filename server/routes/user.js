const express = require('express');
const router = express.Router();

const { login,signup } = require("../Controllers/Auth");
const {auth, isStudent, isAdmin}  = require("../middlewares/auth");
const { authenticateToken }= require('../middlewares/auth')
const {updateCheckedInStatus} = require('../Controllers/User')
const {getGenderCounts} = require('../Controllers/User')
router.post("/login",login);
router.post("/signup",signup);
router.get("/getGenderCounts",getGenderCounts);




//Protected Route
router.get("/student", auth , isStudent, (req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the protected Route for Student",
    })
});

router.get("/admin",auth,isAdmin, (req,res)=>{
    res.json({
        success:true,
        message:'Welcome to the protected Route for Admin',
    })
})


router.get("/test",auth, (req,res)=>{
    res.json({
        success:true,
        message:'Welcome to the protected Route for Test',
    })
})

//to handle the checkin and checkout status of user and update it
router.put('/updateStatus', authenticateToken,updateCheckedInStatus);



module.exports = router;