// const mongoose = require("mongoose");

// // const userSchema = new mongoose.Schema({
// //     name:{
// //         type:String,
// //         required:true,
// //         trim:true,
// //     },
// //     email:{
// //         type:String,
// //         required:true,
// //         trim:true,
// //     },
// //     password:{
// //         type:String,
// //         required:true,
// //     },
// //     role:{
// //         type:String,
// //         enum:["Admin", "Student", "Visitor"]
// //     }
// // });

// // module.exports = mongoose.model("User", userSchema);


// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please enter a name"],
//   },
//   EmployeeId: {
//     type: String,
//     required: [true, "Please enter a name"],
//   },
//   email: {
//     type: String,
//     required: [true, "Please enter an email"],
//     unique: true,
//     // Mongoose's built-in validator for email format
//     match: [/.+@.+\..+/, "Please enter a valid email"],
//   },
//   password: {
//     type: String,
//     required: [true, "Please enter a password"],
//     minlength: [6, "Password must be at least 6 characters long"],
//   },
//   gender: {
//     type: String,
//     enum: ["Male", "Female"],
//     required: [true, "Please select a gender"],
//   },
//   Address: {
//     type: String,
//     required: [true, "Please enter an address"],
//   },
//   OfficeId: {
//     type: String,
//     required: [true, "Please enter office location"],
//   },
//   departmentId: {
//     type: String,
//     required: [true, "Please enter Department"],
//   },
//   office: {
//     type: String,
//     required: [true, "Please enter office location"],
//   },
//   department: {
//     type: String,
//     required: [true, "Please enter Department"],
//   },
//   age: {
//     type: Number,
//     required: [true, "Please enter your age"],
//   },
//   checkedIN: {
//     type: Boolean,
//     default: false,
//   },
//   isadmin: {
//     type: Boolean,
//     default: false,
//   },
// //   checkedIn: {
// //     type: String,
// //     enum: ["checkedIn", "checkout", "notCheckedIN"],
// //     default: "notCheckedIN",
// //   },
// //   checkedInTime: {
// //     type: [Date],
// //     required: true,
// //     default: [],
// //   },
// //   checkedOutTime: {
// //     type: [Date],
// //     required: true,
// //     default: [],
// //   },

// }, {
//   timestamps: true,
// });

// // const User = mongoose.model('User', UserSchema);

// // export default User;

// module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true,
//         trim:true,
//     },
//     email:{
//         type:String,
//         required:true,
//         trim:true,
//     },
//     password:{
//         type:String,
//         required:true,
//     },
//     role:{
//         type:String,
//         enum:["Admin", "Student", "Visitor"]
//     }
// });

// module.exports = mongoose.model("User", userSchema);


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  EmployeeId: {
    type: String,
    required: [true, "Please enter a name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    // Mongoose's built-in validator for email format
    match: [/.+@.+\..+/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: [true, "Please select a gender"],
  },
  Address: {
    type: String,
    required: [true, "Please enter an address"],
  },
  OfficeId: {
    type: String,
    required: [true, "Please enter office location"],
  },
  departmentId: {
    type: String,
    required: [true, "Please enter Department"],
  },
  office: {
    type: String,
    required: [true, "Please enter office location"],
  },
  department: {
    type: String,
    required: [true, "Please enter Department"],
  },
  age: {
    type: Number,
    required: [true, "Please enter your age"],
  },
  checkedIN: {
    type: Boolean,
    default: false,
  },
  isadmin: {
    type: Boolean,
    default: false,
  },
  OfficeLongitude:{
    type: Number,
  },
  OfficeLatitude:{
    type: Number,
  },


}, {
  timestamps: true,
});


module.exports = mongoose.model("User", UserSchema);
