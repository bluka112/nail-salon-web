// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  [key: string]: T | boolean | string | number | undefined;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
}

// Enum Types
export type Status = "active" | "disabled";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type ServiceCategory = 
  | "manicure" 
  | "pedicure" 
  | "gel_acrylic" 
  | "nail_art" 
  | "spa" 
  | "additional";

// Model Types
export interface Branch {
  id: string;
  name: string;
  location: string;
  address: string;
  phoneNumber: string;
  image: string | null;
  latitude: number | null;
  longitude: number | null;
  openingTime: string;
  closingTime: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  employees?: Employee[];
  _count?: { bookings: number };
}

export interface Employee {
  id: string;
  name: string;
  title: string | null;
  image: string | null;
  phoneNumber: string | null;
  email: string | null;
  specialties: string[];
  rating: number;
  status: Status;
  branchId: string;
  branch?: Branch;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: ServiceCategory;
  image: string | null;
  popular: boolean;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingService {
  id: string;
  bookingId: string;
  serviceId: string;
  price: number;
  duration: number;
  service?: Service;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: Date;
  time: string;
  notes: string | null;
  status: BookingStatus;
  totalPrice: number;
  totalDuration: number;
  branchId: string;
  employeeId: string | null;
  branch?: Branch;
  employee?: Employee | null;
  services?: BookingService[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  image: string | null;
  rating: number;
  comment: string;
  service: string | null;
  featured: boolean;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  id: string;
  image: string;
  title: string | null;
  category: string | null;
  featured: boolean;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface Promotion {
  id: string;
  title: string;
  description: string | null;
  discount: number;
  code: string | null;
  validFrom: Date;
  validUntil: Date;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

// API Request Types
export interface CreateBranchRequest {
  name: string;
  location: string;
  address: string;
  phoneNumber: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  openingTime?: string;
  closingTime?: string;
}

export interface CreateEmployeeRequest {
  name: string;
  branchId: string;
  title?: string;
  image?: string;
  phoneNumber?: string;
  email?: string;
  specialties?: string[];
}

export interface CreateServiceRequest {
  name: string;
  price: number;
  duration: number;
  category: ServiceCategory;
  description?: string;
  image?: string;
  popular?: boolean;
}

export interface CreateBookingRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  branchId: string;
  employeeId?: string;
  services: { serviceId: string }[];
  notes?: string;
}

export interface CreateTestimonialRequest {
  name: string;
  rating: number;
  comment: string;
  image?: string;
  service?: string;
  featured?: boolean;
}

export interface CreateGalleryImageRequest {
  image: string;
  title?: string;
  category?: string;
  featured?: boolean;
}

export interface CreatePromotionRequest {
  title: string;
  discount: number;
  validFrom: string;
  validUntil: string;
  description?: string;
  code?: string;
}

// Availability Types
export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailabilityResponse {
  success: boolean;
  date: string;
  branchId: string;
  employeeId?: string;
  slots: TimeSlot[];
}
