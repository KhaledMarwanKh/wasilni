const User = require('../../Models/User');
const catchAsync = require('../../utils/catchAsync');
const ResponseHandler = require('../../utils/responseHandler');

const UserInfo = catchAsync(async (req, res, next) => {
  user = req.user;
  if (!user) {
    return ResponseHandler.sendError(next, {
      statusCode: 401,
      message: 'user not authonticated',
    });
  }
  const user_data = await User.findOne({ _id: req.user._id }).lean();
  if (!user_data) {
    return ResponseHandler.sendError(next, {
      statusCode: 404,
      message: 'not found user',
    });
  }

  return ResponseHandler.sendSuccess(res, {
    statusCode: 200,
    message: 'success!',
    data: user_data,
  });
});

module.exports = UserInfo;
