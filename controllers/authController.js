const User = require('../models/User');
exports.signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const user = await User.create({ username, email, password, role });
    res.status(201).json({ success: true, token: user.getSignedJwtToken() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.status(200).json({ success: true, token: user.getSignedJwtToken() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
