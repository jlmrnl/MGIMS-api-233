const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  staffName: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  totalSales: {
    type: Number,
    default: 0
  },
  shift: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening'],
    required: true
  },
  contacts: {
    email: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    }
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
});

staffSchema.virtual('totalTenure').get(function() {
  // Calculate total tenure based on registrationDate and current date
  const currentDate = new Date();
  const registrationDate = new Date(this.registrationDate);
  const diffInMilliseconds = currentDate - registrationDate;
  const diffInDays = diffInMilliseconds / (1000 * 3600 * 24);
  return Math.floor(diffInDays);
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
