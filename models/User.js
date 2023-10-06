const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  staffProfile: { type: Schema.Types.ObjectId, ref: 'Staff' } // Reference to Staff schema
});

module.exports = mongoose.model('User', userSchema);