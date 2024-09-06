// const Location = require('../models/Office'); // Adjust the path as needed

// // Create a new location
// exports.createLocation = async (req, res) => {
//   try {
//     const { name, latitude, longitude } = req.body;

//     // Check if all required fields are provided
//     if (!name || latitude === undefined || longitude === undefined) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields (name, latitude, longitude).",
//       });
//     }

//     // Create a new location
//     const location = await Location.create({
//       name,
//       latitude,
//       longitude,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Location created successfully",
//       location,
//     });
//   } catch (error) {
//     console.error("Error creating location:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error. Please try again later.",
//     });
//   }
// };

// // Get all locations
// exports.getAllLocations = async (req, res) => {
//   try {
//     const locations = await Location.find();
//     return res.status(200).json({
//       success: true,
//       locations,
//     });
//   } catch (error) {
//     console.error("Error fetching locations:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error. Please try again later.",
//     });
//   }
// };

// const Office = require('../models/Office');

// // Create a new Office
// exports.createOffice = async (req, res) => {
//   try {
//     const { name } = req.body;

//     // Validate input
//     if (!name) {
//       return res.status(400).json({ message: "Office name is required" });
//     }

//     // Create the new Office
//     const newOffice = new Office({ name });

//     // Save the office to the database
//     const savedOffice = await newOffice.save();

//     res.status(201).json(savedOffice);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all Offices
// exports.getAllOffices = async (req, res) => {
//   try {
//     const offices = await Office.find().populate('departments');
//     res.status(200).json(offices);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get an Office by ID
// exports.getOfficeById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const office = await Office.findById(id).populate('departments');

//     if (!office) {
//       return res.status(404).json({ message: "Office not found" });
//     }

//     res.status(200).json(office);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const Office = require('../models/Office');

// Create a new Office
exports.createOffice = async (req, res) => {
  try {
    const { name, distance, latitude, longitude } = req.body;

    // Validate input
    if (!name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, latitude, longitude).",
      });
    }

    // Create the new Office
    const newOffice = new Office({ name,distance, latitude, longitude });

    // Save the office to the database
    const savedOffice = await newOffice.save();

    res.status(201).json({
      success: true,
      message: "Office created successfully",
      office: savedOffice,
    });
  } catch (error) {
    console.error("Error creating office:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Get all Offices
exports.getAllOffices = async (req, res) => {
  try {
    console.log("Get all offices");
    const offices = await Office.find().populate('departments');
    res.status(200).json({
      success: true,
      offices,
    });
  } catch (error) {
    console.error("Error fetching offices:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Get an Office by ID
exports.getOfficeById = async (req, res) => {
  try {
    const { id } = req.params;
    const office = await Office.findById(id).populate('departments');

    if (!office) {
      return res.status(404).json({
        success: false,
        message: "Office not found",
      });
    }

    res.status(200).json({
      success: true,
      office,
    });
  } catch (error) {
    console.error("Error fetching office:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// const Office = require('../models/Office'); // Adjust the path as necessary
const User = require('../models/User'); // Adjust the path as necessary

// Controller to get the count of checked-in employees for a particular office
exports.getCheckedInEmployeesCount = async (req, res) => {
    try {
        const { officeName } = req.params; // Get the office name from request parameters

        // Find the office by its name and populate the employees
        const office = await Office.findOne({ name: officeName }).populate('employees');

        if (!office) {
            return res.status(404).json({ error: 'Office not found.' });
        }

        // Filter the employees who are checked in
        const checkedInEmployees = office.employees.filter(employee => employee.checkedIN);

        // Return the count of checked-in employees
        res.status(200).json({
            office: office.name,
            checkedInCount: checkedInEmployees.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};


exports.getOfficeDetails = async (req, res) => {
  try {
      // Get the employee ID from the request (assuming it's set in req.user by middleware)
      const employeeId = req.user.id;

      // Fetch the employee document to get the OfficeId
      const employee = await User.findById(employeeId);

      if (!employee) {
          return res.status(404).json({ success: false, message: 'Employee not found' });
      }

      // Get the OfficeId from the employee document
      const officeId = employee.OfficeId;

      // Fetch the office details using the OfficeId
      const office = await Office.findById(officeId);

      if (!office) {
          return res.status(404).json({ success: false, message: 'Office not found' });
      }

      // Extract latitude, longitude, and distance from the office object
      const { latitude, longitude, distance } = office;

      // Respond with the office details
      res.status(200).json({
          success: true,
          office: {
              latitude,
              longitude,
              distance
          }
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
};