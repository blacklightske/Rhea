import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';
import { Notification } from '../models/User';
import { authenticateToken } from './auth';

const router = express.Router();

// Get user's notifications
router.get('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const db = getDatabase();
    const notificationsCollection = db.collection<Notification>('notifications');

    const matchQuery: any = {
      userId: new ObjectId(req.user.userId)
    };

    if (unreadOnly === 'true') {
      matchQuery.isRead = false;
    }

    const notifications = await notificationsCollection
      .find(matchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    const total = await notificationsCollection.countDocuments(matchQuery);
    const unreadCount = await notificationsCollection.countDocuments({
      userId: new ObjectId(req.user.userId),
      isRead: false
    });

    res.json({
      notifications,
      unreadCount,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark notification as read
router.patch('/:notificationId/read', authenticateToken, async (req: any, res: Response) => {
  try {
    const { notificationId } = req.params;

    const db = getDatabase();
    const notificationsCollection = db.collection<Notification>('notifications');

    const result = await notificationsCollection.updateOne(
      {
        _id: new ObjectId(notificationId),
        userId: new ObjectId(req.user.userId)
      },
      {
        $set: { isRead: true }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read' });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', authenticateToken, async (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const notificationsCollection = db.collection<Notification>('notifications');

    await notificationsCollection.updateMany(
      {
        userId: new ObjectId(req.user.userId),
        isRead: false
      },
      {
        $set: { isRead: true }
      }
    );

    res.json({ message: 'All notifications marked as read' });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete notification
router.delete('/:notificationId', authenticateToken, async (req: any, res: Response) => {
  try {
    const { notificationId } = req.params;

    const db = getDatabase();
    const notificationsCollection = db.collection<Notification>('notifications');

    const result = await notificationsCollection.deleteOne({
      _id: new ObjectId(notificationId),
      userId: new ObjectId(req.user.userId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });

  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unread count
router.get('/unread-count', authenticateToken, async (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const notificationsCollection = db.collection<Notification>('notifications');

    const unreadCount = await notificationsCollection.countDocuments({
      userId: new ObjectId(req.user.userId),
      isRead: false
    });

    res.json({ unreadCount });

  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;