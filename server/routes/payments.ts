import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';
import { Payment, Booking } from '../models/User';
import { authenticateToken } from './auth';

const router = express.Router();

// Create payment for booking
router.post('/create', authenticateToken, async (req: any, res: Response) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;

    if (!bookingId || !amount || !paymentMethod) {
      return res.status(400).json({ error: 'Booking ID, amount, and payment method are required' });
    }

    const db = getDatabase();
    const bookingsCollection = db.collection<Booking>('bookings');
    const paymentsCollection = db.collection<Payment>('payments');

    // Verify booking exists and belongs to user
    const booking = await bookingsCollection.findOne({
      _id: new ObjectId(bookingId),
      clientId: new ObjectId(req.user.userId)
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ error: 'Payment can only be made for pending bookings' });
    }

    // Check if payment already exists
    const existingPayment = await paymentsCollection.findOne({ bookingId: new ObjectId(bookingId) });
    if (existingPayment) {
      return res.status(400).json({ error: 'Payment already exists for this booking' });
    }

    // Calculate platform fee (5%)
    const platformFee = amount * 0.05;
    const freelancerAmount = amount - platformFee;

    const payment: Omit<Payment, '_id'> = {
      bookingId: new ObjectId(bookingId),
      clientId: new ObjectId(req.user.userId),
      freelancerId: booking.freelancerId,
      amount,
      platformFee,
      freelancerAmount,
      paymentMethod,
      status: 'pending',
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await paymentsCollection.insertOne(payment);

    // Update booking status to paid
    await bookingsCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      {
        $set: {
          status: 'paid',
          updatedAt: new Date()
        }
      }
    );

    // Create notification for freelancer
    const notificationsCollection = db.collection('notifications');
    await notificationsCollection.insertOne({
      userId: booking.freelancerId,
      type: 'payment_received',
      title: 'Payment Received',
      message: `Payment of $${amount} has been received for your booking. You can now start the job.`,
      bookingId: new ObjectId(bookingId),
      isRead: false,
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'Payment created successfully',
      paymentId: result.insertedId,
      transactionId: payment.transactionId,
      amount,
      platformFee,
      freelancerAmount
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payment details
router.get('/:paymentId', authenticateToken, async (req: any, res: Response) => {
  try {
    const { paymentId } = req.params;

    const db = getDatabase();
    const paymentsCollection = db.collection<Payment>('payments');

    const payment = await paymentsCollection.findOne({ _id: new ObjectId(paymentId) });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check if user is authorized to view this payment
    if (!payment.clientId.equals(req.user.userId) && !payment.freelancerId.equals(req.user.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(payment);

  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's payments (client or freelancer)
router.get('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const db = getDatabase();
    const paymentsCollection = db.collection<Payment>('payments');

    const matchQuery: any = {
      $or: [
        { clientId: new ObjectId(req.user.userId) },
        { freelancerId: new ObjectId(req.user.userId) }
      ]
    };

    if (status) {
      matchQuery.status = status;
    }

    const payments = await paymentsCollection
      .find(matchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    const total = await paymentsCollection.countDocuments(matchQuery);

    res.json({
      payments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Release payment to freelancer (when job is completed)
router.patch('/:paymentId/release', authenticateToken, async (req: any, res: Response) => {
  try {
    const { paymentId } = req.params;

    const db = getDatabase();
    const paymentsCollection = db.collection<Payment>('payments');
    const bookingsCollection = db.collection<Booking>('bookings');

    const payment = await paymentsCollection.findOne({ _id: new ObjectId(paymentId) });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check if user is the client who made the payment
    if (!payment.clientId.equals(req.user.userId)) {
      return res.status(403).json({ error: 'Only the client can release payment' });
    }

    // Check if booking is completed
    const booking = await bookingsCollection.findOne({ _id: payment.bookingId });
    if (!booking || booking.status !== 'completed') {
      return res.status(400).json({ error: 'Payment can only be released for completed bookings' });
    }

    if (payment.status === 'released') {
      return res.status(400).json({ error: 'Payment has already been released' });
    }

    // Update payment status to released
    await paymentsCollection.updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          status: 'released',
          releasedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );

    // Create notification for freelancer
    const notificationsCollection = db.collection('notifications');
    await notificationsCollection.insertOne({
      userId: payment.freelancerId,
      type: 'payment_released',
      title: 'Payment Released',
      message: `Payment of $${payment.freelancerAmount} has been released to you for the completed job.`,
      bookingId: payment.bookingId,
      isRead: false,
      createdAt: new Date()
    });

    res.json({ message: 'Payment released successfully' });

  } catch (error) {
    console.error('Error releasing payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payment statistics for freelancer
router.get('/stats/freelancer', authenticateToken, async (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const paymentsCollection = db.collection<Payment>('payments');

    const stats = await paymentsCollection.aggregate([
      {
        $match: {
          freelancerId: new ObjectId(req.user.userId)
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$freelancerAmount' }
        }
      }
    ]).toArray();

    const totalEarnings = await paymentsCollection.aggregate([
      {
        $match: {
          freelancerId: new ObjectId(req.user.userId),
          status: 'released'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$freelancerAmount' }
        }
      }
    ]).toArray();

    res.json({
      stats,
      totalEarnings: totalEarnings[0]?.total || 0
    });

  } catch (error) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;