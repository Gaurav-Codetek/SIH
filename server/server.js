const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const mongoose = require('mongoose');

// // Connect to MongoDB
mongoose.connect("mongodb+srv://johnkhore26:RoOrWmTmyzRB1LlN@cluster0.n4dgy.mongodb.net/", {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connection Successful");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

//route import and mount
const user = require("./routes/user");
const checkinRoutes = require('./routes/checkin')

app.use("/api/v1", user);
app.use('/api/checkins', checkinRoutes);


app.listen(3000, ()=>{
    console.log("Server is running on port : 3000");
})


