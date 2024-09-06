const express = require('express');
const router = express.Router();
// const { createLocation,getAllLocations } = require('../Controllers/Office'); // Adjust the path as needed
const {createOffice,getAllOffices,getOfficeById,getCheckedInEmployeesCount,getOfficeDetails} =require('../Controllers/Office');
const { authenticateToken } = require('../Controllers/Auth');

// Route to create a new Office
router.post('/createOffice', createOffice);

// Route to get all Office
router.get('/getAllOffices', getAllOffices);

// http://192.168.18.208:3000/api/office/66d96a4620494a783f0dfa1a
router.get('/:id', getOfficeById);

router.get('/getCheckedInEmployeesCount/:officeName',getCheckedInEmployeesCount);
router.get('/getOfficeDetails',authenticateToken,getOfficeDetails);

module.exports = router;

//should we write that
// no need just move to signuup controlled 
// no no auth controller -> exports.signup
