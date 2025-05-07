exports.UserInfo = (req, res) => {
  try {
    user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    return res.status(200).json({ data: user, message: 'success!' });
  } catch (error) {
    console.log(`error: ${error.message}`);
    return res.status(500).json({ message: `error occured${error.message}` });
  }
};
