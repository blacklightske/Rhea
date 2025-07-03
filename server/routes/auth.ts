import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';
import { User } from '../models/User';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Signup route
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      userType,
      mpesaNumber,
      serviceCategories,
      termsAccepted
    } = req.body;

    // Validation
    if (!name || !email || !phoneNumber || !password || !userType) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (userType === 'freelancer') {
      if (!mpesaNumber || !serviceCategories || !termsAccepted) {
        return res.status(400).json({ 
          error: 'Freelancers must provide M-Pesa number, service categories, and accept terms' 
        });
      }
    }

    const db = getDatabase();
    const usersCollection = db.collection<User>('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or phone number already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user object
    const newUser: User = {
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      userType,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add freelancer specific fields
    if (userType === 'freelancer') {
      newUser.mpesaNumber = mpesaNumber;
      newUser.serviceCategories = serviceCategories;
      newUser.kycVerified = false;
      newUser.termsAccepted = termsAccepted;
      newUser.isActive = true;
      newUser.rating = { average: 0, count: 0 };
    }

    // Insert user
    const result = await usersCollection.insertOne(newUser);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.insertedId, 
        email, 
        userType 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'User created successfully',
      user: { ...userWithoutPassword, _id: result.insertedId },
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: 'Email/phone and password are required' });
    }

    const db = getDatabase();
    const usersCollection = db.collection<User>('users');

    // Find user by email or phone
    const user = await usersCollection.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        userType: user.userType 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to verify JWT token
export const authenticateToken = (req: any, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get current user profile
router.get('/profile', authenticateToken, async (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const usersCollection = db.collection<User>('users');
    
    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;