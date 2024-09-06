const mongoose = require('mongoose');

const LiveStatSchema = new mongoose.Schema(
  {
    Date_of_rec: {
      type: String,
      required: true,
    },
    Employ_checkedin: [
      {
        employeeId: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const LiveState = mongoose.model('LiveStat', LiveStatSchema);

module.exports = LiveState;
