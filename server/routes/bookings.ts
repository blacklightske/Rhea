import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';
import { Booking, Notification, Payment } from '../models/User';
import { authenticateToken } from './auth';

const router = express.Router();

// Create a new booking
router.post('/', authenticateToken, async (req: any, res: Response) => {
  try {
    if (req.user.userType !== 'client') {
      return res.status(403).json({ error: 'Only clients can create bookings' });
    }

    const {
      freelancerId,
      serviceId,
      packageId,
      serviceCategory,
      serviceName,
      packageName,
      scheduledDate,
      estimatedHours,
      totalAmount,
      serviceLocation,
      beforePhotos,
      specialInstructions
    } = req.body;

    // Validation
    if (!freelancerId || !serviceId || !packageId || !scheduledDate || !totalAmount || !serviceLocation) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const platformFee = Math.round(totalAmount * 0.05 * 100) / 100; // 5% platform fee
    const freelancerAmount = totalAmount - platformFee;

    const db = getDatabase();
    const bookingsCollection = db.collection<Booking>('bookings');
    const notificationsCollection = db.collection<Notification>('notifications');

    const newBooking: Booking = {
      clientId: new ObjectId(req.user.userId),
      freelancerId: new ObjectId(freelancerId),
      serviceId: new ObjectId(serviceId),
      packageId: new ObjectId(packageId),
      serviceCategory,
      serviceName,
      packageName,
      scheduledDate: new Date(scheduledDate),
      estimatedHours,
      totalAmount,
      platformFee,
      freelancerAmount,
      serviceLocation,
      beforePhotos: beforePhotos || [],
      specialInstructions,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await bookingsCollection.insertOne(newBooking);
    
    // Create notification for freelancer
    const notification: Notification = {
      userId: new ObjectId(freelancerId),
      type: 'booking_request',
      title: 'New Booking Request',
      message: `You have a new booking request for ${serviceName}`,
      data: { bookingId: result.insertedId },
      isRead: false,
      createdAt: new Date()
    };
    
    await notificationsCollection.insertOne(notification);

    res.status(201).json({
      message: 'Booking created successfully',
      booking: { ...newBooking, _id: result.insertedId }
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's bookings
router.get('/my-bookings', authenticateToken, async (req: any, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const db = getDatabase();
    const bookingsCollection = db.collection<Booking>('bookings');

    const matchQuery: any = {};
    
    if (req.user.userType === 'client') {
      matchQuery.clientId = new ObjectId(req.user.userId);
    } else if (req.user.userType === 'freelancer') {
      matchQuery.freelancerId = new ObjectId(req.user.userId);
    }

    if (status) {
      matchQuery.status = status;
    }

    const bookings = await bookingsCollection.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'users',
          localField: req.user.userType === 'client' ? 'freelancerId' : 'clientId',
          foreignField: '_id',
          as: 'otherUser'
        }
      },
      {
        $unwind: '$otherUser'
      },
      {
        $project: {
          serviceCategory: 1,
          serviceName: 1,
          packageName: 1,
          scheduledDate: 1,
          estimatedHours: 1,
          totalAmount: 1,
          platformFee: 1,
          freelancerAmount: 1,
          serviceLocation: 1,
          beforePhotos: 1,
          afterPhotos: 1,
          specialInstructions: 1,
          status: 1,
          paymentStatus: 1,
          createdAt: 1,
          acceptedAt: 1,
          startedAt: 1,
          completedAt: 1,
          clientReview: 1,
          freelancerReview: 1,
          'otherUser._id': 1,
          'otherUser.name': 1,
          'otherUser.profileImage': 1,
          'otherUser.rating': 1
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: Number(limit) }
    ]).toArray();

    const total = await bookingsCollection.countDocuments(matchQuery);

    res.json({
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update booking status (accept/reject/start/complete)
router.patch('/:bookingId/status', authenticateToken, async (req: any, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status, beforePhotos } = req.body;

    const db = getDatabase();
    const bookingsCollection = db.collection<Booking>('bookings');
    const notificationsCollection = db.collection<Notification>('notifications');

    // Get the booking first
    const booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization
    const isFreelancer = req.user.userType === 'freelancer' && booking.freelancerId.toString() === req.user.userId;
    const isClient = req.user.userType === 'client' && booking.clientId.toString() === req.user.userId;
    
    if (!isFreelancer && !isClient) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updateData: any = { status };
    let notificationData: Partial<Notification> = {
      isRead: false,
      createdAt: new Date()
    };

    // Handle different status updates
    switch (status) {
      case 'accepted':
        if (!isFreelancer) {
          return res.status(403).json({ error: 'Only freelancers can accept bookings' });
        }
        updateData.acceptedAt = new Date();
        notificationData = {
          ...notificationData,
          userId: booking.clientId,
          type: 'booking_accepted',
          title: 'Booking Accepted',
          message: `Your booking for ${booking.serviceName} has been accepted`,
          data: { bookingId: new ObjectId(bookingId) }
        };
        break;

      case 'rejected':
        if (!isFreelancer) {
          return res.status(403).json({ error: 'Only freelancers can reject bookings' });
        }
        notificationData = {
          ...notificationData,
          userId: booking.clientId,
          type: 'booking_rejected',
          title: 'Booking Rejected',
          message: `Your booking for ${booking.serviceName} has been rejected`,
          data: { bookingId: new ObjectId(bookingId) }
        };
        break;

      case 'in_progress':
        if (!isFreelancer) {
          return res.status(403).json({ error: 'Only freelancers can start jobs' });
        }
        if (!beforePhotos || beforePhotos.length === 0) {
          return res.status(400).json({ error: 'Before photos are required to start the job' });
        }
        updateData.startedAt = new Date();
        updateData.beforePhotos = [...(booking.beforePhotos || []), ...beforePhotos];
        notificationData = {
          ...notificationData,
          userId: booking.clientId,
          type: 'job_started',
          title: 'Job Started',
          message: `Work has started on your ${booking.serviceName} booking`,
          data: { bookingId: new ObjectId(bookingId) }
        };
        break;

      case 'completed':
        if (isFreelancer) {
          // Freelancer marking as completed
          updateData.completedAt = new Date();
          notificationData = {
            ...notificationData,
            userId: booking.clientId,
            type: 'job_completed',
            title: 'Job Completed',
            message: `Your ${booking.serviceName} booking has been completed. Please review and confirm.`,
            data: { bookingId: new ObjectId(bookingId) }
          };
        } else if (isClient) {
          // Client confirming completion - release payment
          updateData.paymentStatus = 'released';
          // Here you would integrate with payment system to release funds
        }
        break;

      default:
        return res.status(400).json({ error: 'Invalid status' });
    }

    // Update booking
    await bookingsCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: updateData }
    );

    // Create notification
    if (notificationData.userId) {
      await notificationsCollection.insertOne(notificationData as Notification);
    }

    res.json({ message: 'Booking status updated successfully' });

  } catch (error) {
    console.error('Booking status update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add review to booking
router.post('/:bookingId/review', authenticateToken, async (req: any, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const db = getDatabase();
    const bookingsCollection = db.collection<Booking>('bookings');
    const usersCollection = db.collection('users');
    const notificationsCollection = db.collection<Notification>('notifications');

    const booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const isClient = req.user.userType === 'client' && booking.clientId.toString() === req.user.userId;
    const isFreelancer = req.user.userType === 'freelancer' && booking.freelancerId.toString() === req.user.userId;
    
    if (!isClient && !isFreelancer) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const review = {
      rating,
      comment,
      createdAt: new Date()
    };

    const updateField = isClient ? 'clientReview' : 'freelancerReview';
    const revieweeId = isClient ? booking.freelancerId : booking.clientId;

    // Update booking with review
    await bookingsCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { [updateField]: review } }
    );

    // Update freelancer's rating if client is reviewing
    if (isClient) {
      const freelancerBookings = await bookingsCollection.find({
        freelancerId: booking.freelancerId,
        clientReview: { $exists: true }
      }).toArray();

      const totalRating = freelancerBookings.reduce((sum, b) => sum + (b.clientReview?.rating || 0), 0);
      const averageRating = totalRating / freelancerBookings.length;

      await usersCollection.updateOne(
        { _id: booking.freelancerId },
        {
          $set: {
            'rating.average': Math.round(averageRating * 10) / 10,
            'rating.count': freelancerBookings.length
          }
        }
      );
    }

    // Create notification
    const notification: Notification = {
      userId: revieweeId,
      type: 'review_received',
      title: 'New Review Received',
      message: `You received a ${rating}-star review`,
      data: { bookingId: new ObjectId(bookingId), rating },
      isRead: false,
      createdAt: new Date()
    };
    
    await notificationsCollection.insertOne(notification);

    res.json({ message: 'Review added successfully' });

  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get booking details
router.get('/:bookingId', authenticateToken, async (req: any, res: Response) => {
  try {
    const { bookingId } = req.params;

    const db = getDatabase();
    const bookingsCollection = db.collection<Booking>('bookings');

    const booking = await bookingsCollection.aggregate([
      { $match: { _id: new ObjectId(bookingId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'freelancerId',
          foreignField: '_id',
          as: 'freelancer'
        }
      },
      {
        $unwind: '$client'
      },
      {
        $unwind: '$freelancer'
      },
      {
        $project: {
          serviceCategory: 1,
          serviceName: 1,
          packageName: 1,
          scheduledDate: 1,
          estimatedHours: 1,
          totalAmount: 1,
          platformFee: 1,
          freelancerAmount: 1,
          serviceLocation: 1,
          beforePhotos: 1,
          afterPhotos: 1,
          specialInstructions: 1,
          status: 1,
          paymentStatus: 1,
          createdAt: 1,
          acceptedAt: 1,
          startedAt: 1,
          completedAt: 1,
          clientReview: 1,
          freelancerReview: 1,
          'client._id': 1,
          'client.name': 1,
          'client.profileImage': 1,
          'freelancer._id': 1,
          'freelancer.name': 1,
          'freelancer.profileImage': 1,
          'freelancer.rating': 1
        }
      }
    ]).toArray();

    if (booking.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = booking[0];
    
    // Check authorization
    const isAuthorized = 
      bookingData.client._id.toString() === req.user.userId ||
      bookingData.freelancer._id.toString() === req.user.userId;
    
    if (!isAuthorized) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ booking: bookingData });

  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;