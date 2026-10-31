const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/utils');
const prisma = require('../utils/db');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { email, password, fullName, currency = 'NGN' } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedName = typeof fullName === 'string' ? fullName.trim() : '';

    // Validate required fields
    if (!normalizedEmail || !password || !normalizedName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and full name'
      });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }
    if (!['NGN', 'KES', 'GHS', 'USD', 'EUR'].includes(currency)) {
      return res.status(400).json({ success: false, message: 'Unsupported currency' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        fullName: normalizedName,
        currency,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        currency: true,
        createdAt: true,
      }
    });

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    // Validate required fields
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * Get current user (protected)
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    // User is already attached to req by the protect middleware
    res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user data'
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = {};
    const allowedCurrencies = ['NGN', 'KES', 'GHS', 'USD', 'EUR'];

    if (req.body.fullName !== undefined) {
      const fullName = typeof req.body.fullName === 'string' ? req.body.fullName.trim() : '';
      if (!fullName || fullName.length > 120) {
        return res.status(400).json({ success: false, message: 'Name must be between 1 and 120 characters' });
      }
      data.fullName = fullName;
    }
    if (req.body.email !== undefined) {
      const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Enter a valid email address' });
      }
      data.email = email;
    }
    if (req.body.currency !== undefined) {
      if (!allowedCurrencies.includes(req.body.currency)) {
        return res.status(400).json({ success: false, message: 'Unsupported currency' });
      }
      data.currency = req.body.currency;
    }
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, message: 'No profile changes provided' });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, email: true, fullName: true, currency: true, createdAt: true },
    });
    return res.json({ success: true, message: 'Profile updated successfully', data: { user } });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({ success: false, message: 'Choose a password different from your current one' });
    }

    const password = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: req.user.id }, data: { password } });
    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update password' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { currentPassword, confirmation } = req.body;
    if (confirmation !== 'DELETE' || typeof currentPassword !== 'string') {
      return res.status(400).json({ success: false, message: 'Type DELETE and enter your current password to confirm' });
    }
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    await prisma.user.delete({ where: { id: req.user.id } });
    return res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete account' });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword, deleteAccount };
