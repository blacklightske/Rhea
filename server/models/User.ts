import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  userType: 'client' | 'freelancer';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Freelancer specific fields
  mpesaNumber?: string;
  serviceCategories?: string[];
  kycVerified?: boolean;
  termsAccepted?: boolean;
  profileImage?: string;
  bio?: string;
  location?: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  rating?: {
    average: number;
    count: number;
  };
  isActive?: boolean;
  
  // Client specific fields
  preferredPaymentMethod?: string;
}

export interface FreelancerService {
  _id?: ObjectId;
  freelancerId: ObjectId;
  serviceCategory: string;
  serviceName: string;
  description: string;
  packages: ServicePackage[];
  images?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServicePackage {
  _id?: ObjectId;
  name: string;
  description: string;
  price: number;
  duration: string; // e.g., "2 hours", "1 day"
  features: string[];
  isActive: boolean;
}

export interface Booking {
  _id?: ObjectId;
  clientId: ObjectId;
  freelancerId: ObjectId;
  serviceId: ObjectId;
  packageId: ObjectId;
  
  // Booking details
  serviceCategory: string;
  serviceName: string;
  packageName: string;
  scheduledDate: Date;
  estimatedHours: number;
  totalAmount: number;
  platformFee: number; // 5% of total amount
  freelancerAmount: number; // total - platform fee
  
  // Location and service type
  serviceLocation: {
    type: 'client_location' | 'freelancer_location';
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Photos and instructions
  beforePhotos: string[];
  afterPhotos?: string[];
  specialInstructions?: string;
  
  // Status tracking
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled' | 'paid' | 'started';
  paymentStatus: 'pending' | 'paid' | 'released' | 'refunded';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  
  // Reviews
  clientReview?: {
    rating: number;
    comment?: string;
    createdAt: Date;
  };
  freelancerReview?: {
    rating: number;
    comment?: string;
    createdAt: Date;
  };
}

export interface Notification {
  _id?: ObjectId;
  userId: ObjectId;
  type: 'booking_request' | 'booking_accepted' | 'booking_rejected' | 'payment_received' | 'job_started' | 'job_completed' | 'review_received';
  title: string;
  message: string;
  data?: any; // Additional data like booking ID
  isRead: boolean;
  createdAt: Date;
}

export interface Payment {
  _id?: ObjectId;
  bookingId: ObjectId;
  clientId: ObjectId;
  freelancerId: ObjectId;
  amount: number;
  platformFee: number;
  freelancerAmount: number;
  paymentMethod: 'mpesa' | 'card' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'released';
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
  releasedAt?: Date;
}