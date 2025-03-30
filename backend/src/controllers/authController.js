const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        requiresPasswordSetup: !user.hasSetPassword,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.setPassword = async (req, res) => {
  try {
    const { username, newPassword, role } = req.body;
    
    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    user.hasSetPassword = true;
    await user.save();

    res.json({ message: 'Password set successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to set password' });
  }
};