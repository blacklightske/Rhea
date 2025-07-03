import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';
import { FreelancerService, User } from '../models/User';
import { authenticateToken } from './auth';

const router = express.Router();

// Get all service categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = [
      'House Cleaning',
      'Plumbing',
      'Electrical Work',
      'Gardening',
      'Handyman Services',
      'Moving Help',
      'Painting',
      'Carpentry',
      'Appliance Repair',
      'Pest Control',
      'Laundry Services',
      'Car Wash',
      'Beauty Services',
      'Tutoring',
      'Pet Care'
    ];
    
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new service (freelancers only)
router.post('/', authenticateToken, async (req: any, res: Response) => {
  try {
    if (req.user.userType !== 'freelancer') {
      return res.status(403).json({ error: 'Only freelancers can create services' });
    }

    const {
      serviceCategory,
      serviceName,
      description,
      packages,
      images
    } = req.body;

    if (!serviceCategory || !serviceName || !description || !packages || packages.length === 0) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const db = getDatabase();
    const servicesCollection = db.collection<FreelancerService>('services');

    const newService: FreelancerService = {
      freelancerId: new ObjectId(req.user.userId),
      serviceCategory,
      serviceName,
      description,
      packages: packages.map((pkg: any) => ({
        ...pkg,
        _id: new ObjectId(),
        isActive: true
      })),
      images: images || [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await servicesCollection.insertOne(newService);
    
    res.status(201).json({
      message: 'Service created successfully',
      service: { ...newService, _id: result.insertedId }
    });

  } catch (error) {
    console.error('Service creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get services by category
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const db = getDatabase();
    const servicesCollection = db.collection<FreelancerService>('services');
    const usersCollection = db.collection<User>('users');

    const skip = (Number(page) - 1) * Number(limit);

    // Get services with freelancer details
    const services = await servicesCollection.aggregate([
      {
        $match: {
          serviceCategory: category,
          isActive: true
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
        $unwind: '$freelancer'
      },
      {
        $match: {
          'freelancer.isActive': true
        }
      },
      {
        $project: {
          serviceCategory: 1,
          serviceName: 1,
          description: 1,
          packages: 1,
          images: 1,
          createdAt: 1,
          'freelancer._id': 1,
          'freelancer.name': 1,
          'freelancer.rating': 1,
          'freelancer.location': 1,
          'freelancer.profileImage': 1
        }
      },
      { $skip: skip },
      { $limit: Number(limit) }
    ]).toArray();

    const total = await servicesCollection.countDocuments({
      serviceCategory: category,
      isActive: true
    });

    res.json({
      services,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get freelancer's services
router.get('/my-services', authenticateToken, async (req: any, res: Response) => {
  try {
    if (req.user.userType !== 'freelancer') {
      return res.status(403).json({ error: 'Only freelancers can access this endpoint' });
    }

    const db = getDatabase();
    const servicesCollection = db.collection<FreelancerService>('services');

    const services = await servicesCollection.find({
      freelancerId: new ObjectId(req.user.userId)
    }).toArray();

    res.json({ services });

  } catch (error) {
    console.error('Error fetching freelancer services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update service
router.put('/:serviceId', authenticateToken, async (req: any, res: Response) => {
  try {
    if (req.user.userType !== 'freelancer') {
      return res.status(403).json({ error: 'Only freelancers can update services' });
    }

    const { serviceId } = req.params;
    const updateData = req.body;

    const db = getDatabase();
    const servicesCollection = db.collection<FreelancerService>('services');

    const result = await servicesCollection.updateOne(
      {
        _id: new ObjectId(serviceId),
        freelancerId: new ObjectId(req.user.userId)
      },
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Service not found or unauthorized' });
    }

    res.json({ message: 'Service updated successfully' });

  } catch (error) {
    console.error('Service update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get service details
router.get('/:serviceId', async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;
    
    const db = getDatabase();
    const servicesCollection = db.collection<FreelancerService>('services');

    const service = await servicesCollection.aggregate([
      {
        $match: {
          _id: new ObjectId(serviceId),
          isActive: true
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
        $unwind: '$freelancer'
      },
      {
        $project: {
          serviceCategory: 1,
          serviceName: 1,
          description: 1,
          packages: 1,
          images: 1,
          createdAt: 1,
          'freelancer._id': 1,
          'freelancer.name': 1,
          'freelancer.rating': 1,
          'freelancer.location': 1,
          'freelancer.profileImage': 1,
          'freelancer.bio': 1
        }
      }
    ]).toArray();

    if (service.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service: service[0] });

  } catch (error) {
    console.error('Error fetching service details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;