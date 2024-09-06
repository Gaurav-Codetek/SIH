// const LiveState = require('../Models/LiveStats.js');
const LiveState = require('../models/LiveStats')

// import LiveState from "../Models/LiveStats.js";

// Function to handle the recent data request
exports.recentData = async (req, res, next) => {
  try {
    const collec = await LiveState.findOne({ Date_of_rec: "29" });
    const total = collec?.Employ_checkedin;
    const numEmployee = total?.length || 0;
    const response = {
      totalEmp: numEmployee,
    };
    return res.json(response);
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};

// // Function to handle the employee check-in request
// exports.CheckedIn = async (req, res, next) => {
//   try {
//     const { employee } = req.body;
    
//     const now = new Date();
//     const day = String(now.getDate()).padStart(2, '0');
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const year = now.getFullYear();
//     const formattedDate = `${day}${month}${year}`;
    
//     const Today = await LiveState.findOne({ Date_of_rec: formattedDate });
//     if (Today) {
//       await Today.updateOne({
//         $push: { Employ_checkedin: { employeeId: employee } },
//       });
//       console.log("Checking Pre built");
//     } else {
//       await LiveState.create({
//         Date_of_rec: formattedDate,
//         Employ_checkedin: [{ employeeId: employee }],
//       });
//       console.log("Creating new one");
//     }
//     return res.json({ message: employee });
//   } catch (error) {
//     next(error); // Pass the error to the next middleware
//   }
// };
exports.CheckedIn = async (req, res, next) => {
  try {
    // const { employee } = req.body;
    console.log('req:',req);
    console.log('req.user:',req.user);
    // console.log('req:',req.user.id);
		const employee = req.user.id;


    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}${month}${year}`;

    const Today = await LiveState.findOne({ Date_of_rec: formattedDate });
    if (Today) {
      // Use $addToSet to add the employeeId only if it doesn't already exist
      await Today.updateOne({
        $addToSet: { Employ_checkedin: { employeeId: employee } },
      });
      console.log("Checked in employee or already exists");
    } else {
      await LiveState.create({
        Date_of_rec: formattedDate,
        Employ_checkedin: [{ employeeId: employee }],
      });
      console.log("Created new entry and checked in employee");
    }

    return res.json({ message: employee });
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};

// Function to handle the employee check-out request
exports.CheckedOUT = async (req, res, next) => {
  try {
    // const { employee } = req.body;
		const employee = req.user.id;
    
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}${month}${year}`;
    
    await LiveState.findOneAndUpdate(
      { Date_of_rec: formattedDate },
      {
        $pull: { Employ_checkedin: { employeeId: employee } },
      }
    );
    return res.json({ message: employee });
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};
