import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Template from '../models/Template.js';
import Form from '../models/Form.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body; //extract 
  if (!name || !email || !password) {
    res.status(400).json({ message: 'Please provide all required fields' });
    return;
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);//hash password
  try { //then create new user after 
    const user = await User.create({ 
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user, please try again later.' });
  }
});

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Please provide email and password' });
    return;
  }
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.isBlocked) {
      return res.status(403).json({ message: 'User is blocked' });
    }
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// @desc    Get user templates
// @route   GET /api/users/templates
// @access  Private
export const getUserTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ user: req.user._id })
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user forms
// @route   GET /api/users/forms
// @access  Private
export const getUserForms = async (req, res) => {
  try {
    const forms = await Form.find({ user: req.user._id })
      .populate('template', 'title')
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get all users
// @route   GET /api/users/all
// @access  Private (Admin only)
export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Block a user
// @route   PATCH /api/users/:id/block
// @access  Private (Admin only)
export const blockUser = async (req, res) => {
  try {
    const userToBlock = await User.findById(req.params.id);
    if (!userToBlock) {
      return res.status(404).json({ message: 'User not found' });
    }

    userToBlock.isBlocked = true;
    await userToBlock.save();

    const currentUser = await User.findById(req.user._id);
    if (!currentUser.blockedUsers.includes(userToBlock._id)) {
      currentUser.blockedUsers.push(userToBlock._id);
      await currentUser.save();
    }

    res.status(200).json({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Unblock a user
// @route   PATCH /api/users/:id/unblock
// @access  Private (Admin only)
export const unblockUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = false;
    await user.save();

    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Logout a user
// @route   POST /api/users/logout
// @access  Private
//logout could be improved later on
export const logout = async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
