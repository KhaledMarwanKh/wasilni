const User_vehicle = require('../Models/user_vehicle');
const catchAsync = require('../utils/catchAsync');

exports.changeValidValue = async (driver_id, value) => {
  const user_vehicle = await User_vehicle.findOneAndUpdate(
    { driver_id: driver_id },
    { valid: value }, // Fixed typo from 'vlaid' to 'valid'
    { new: true } // Returns the updated document
  ).select('valid'); // Only return the 'valid' field

  console.log('becomes : ', user_vehicle.valid);
};
