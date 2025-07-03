import express, { Application } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

import { connectToDatabase } from './config/database';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import servicesRouter from './routes/services';
import bookingsRouter from './routes/bookings';
import notificationsRouter from './routes/notifications';
import paymentsRouter from './routes/payments';

const app: Application = express();

// Connect to MongoDB
connectToDatabase();

// Add this to debug
console.log('Setting up Express app with TypeScript routes');

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json({ limit: '10mb' })); // Increased limit for photo uploads
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/payments', paymentsRouter);

export default app;