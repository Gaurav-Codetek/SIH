const User = require('../models/User'); 

// Controller to update the checkedIN status of a user
exports.updateCheckedInStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.body; 

        if (typeof status !== 'boolean') {
            return res.status(400).json({ error: 'Status must be a boolean (true or false).' });
        }

        // Find the user by ID and update the checkedIN status
        const user = await User.findByIdAndUpdate(userId, { checkedIN: status }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({
            message: 'CheckedIN status updated successfully.',
            user
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};


exports.getGenderCounts = async (req, res) => {
    try {
      // Count the number of male employees
      const maleCount = await User.countDocuments({ gender: 'Male' });
  
      // Count the number of female employees
      const femaleCount = await User.countDocuments({ gender: 'Female' });
  
      // Return the counts in the desired format
      res.status(200).json({ data: [femaleCount,maleCount] });
    } catch (error) {
      console.error('Error retrieving gender counts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };