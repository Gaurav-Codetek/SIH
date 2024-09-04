const express = require('express');
const router = express.Router();
const Checkin = require('../models/Checkin');
const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {


// const authenticateToken = (req, res, next) => {
//     // authorization -> check if i have to write capital letters or not
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) return res.sendStatus(401);
  
//     jwt.verify(token, 'your_jwt_secret', (err, user) => {
//       if (err) return res.sendStatus(403);
//       req.user = user;
//       next();
//     });
// };

const authenticateToken = async (req, res, next) => {
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
            console.log(decode);
            req.user = decode;
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

// router.post('/checkin', authenticateToken, async (req, res) => {
//     const { latitude, longitude, status } = req.body;
//     try {
// 		const id = req.user.id;
//       const newCheckin = new Checkin({
//         // userId: req.user.userId,
//         userId: id,
//         latitude,
//         longitude,
//         status
//       });
//       await newCheckin.save();
//       res.status(201).send('Check-in recorded');
//     } catch (error) {
//       res.status(400).send('Error recording check-in');
//     }
//   });

router.post('/checkin', authenticateToken, async (req, res) => {
    const { latitude, longitude, status } = req.body;
    try {
      const checkin = await Checkin.findOne({ userId: req.user.id });
      if (!checkin) {
          // If no checkin exists for the user, create a new one
          const newCheckin = new Checkin({
              userId: req.user.id,
              checkins: [{ status, latitude, longitude }]
          });
          await newCheckin.save();
          res.status(201).send('Check-in recorded');
      } else {
          // If a checkin already exists, add the new checkin to the array
          checkin.checkins.push({ status, latitude, longitude });
          await checkin.save();
          res.status(201).send('Check-in recorded');
      }
    } catch (error) {
      res.status(400).send('Error recording check-in');
    }
});



router.get('/checkins', authenticateToken, async (req, res) => {
    try {
        // Find the check-ins for the authenticated user
        const checkin = await Checkin.findOne({ userId: req.user.id });
        
        if (!checkin) {
            return res.status(404).json({
                success: false,
                message: 'No check-ins found for this user',
            });
        }

        res.status(200).json({
            success: true,
            checkins: checkin.checkins,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving check-ins',
        });
    }
});

module.exports = router;