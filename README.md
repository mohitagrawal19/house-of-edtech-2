# House of EdTech

A modern, full-stack educational technology platform built with Next.js, React, TypeScript, and MongoDB.

## Features

- 🎓 **Course Management**: Create, browse, and enroll in courses
- 👤 **User Authentication**: Secure JWT-based authentication
- 👨‍🏫 **Instructor Dashboard**: Manage courses and track student progress
- 📚 **Course Details**: Rich course information with learning outcomes
- 🔍 **Advanced Filtering**: Filter courses by category, level, and search terms
- 💾 **MongoDB Integration**: Robust database with Mongoose ODM
- 🎨 **Modern UI**: Beautiful gradient-based design with smooth animations
- 🔒 **Secure**: Password hashing, JWT tokens, input validation

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **Styling**: Inline React styles with CSS-in-JS
- **Validation**: Zod schema validation
- **HTTP Client**: Axios
- **Security**: CORS, Helmet, rate limiting

## Getting Started

### Prerequisites

- Node.js 16+
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd house-of-edtech
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env .env.local
```

Configure these variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Usage

### User Roles

- **Student**: Browse courses, enroll, and track progress
- **Instructor**: Create and manage courses, view enrollments

### Key Pages

- `/` - Home page with featured courses
- `/courses` - Browse all courses with filtering
- `/courses/[id]` - Course detail page with enrollment
- `/instructor` - Instructor dashboard (instructor only)
- `/profile` - User profile management
- `/auth/login` - Login page
- `/auth/register` - Registration page

## Project Structure

```
src/
├── components/      # React components (Button, Navbar, etc.)
├── pages/          # Next.js pages and API routes
├── hooks/          # Custom React hooks (useAuth)
├── lib/            # Utility functions and database
├── types/          # TypeScript type definitions
├── utils/          # Helper functions
└── styles/         # Global CSS
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/me` - Get current user (protected)
- `GET /api/users/[id]` - Get user profile
- `PUT /api/users/[id]` - Update user profile (protected)

### Courses
- `GET /api/courses` - Get all courses with pagination
- `GET /api/courses/[id]` - Get course details
- `POST /api/courses` - Create course (instructor only)
- `PUT /api/courses/[id]` - Update course (instructor only)
- `DELETE /api/courses/[id]` - Delete course (instructor only)
- `POST /api/courses/[id]?action=enroll` - Enroll in course (protected)

## Build & Deployment

### Build for production:
```bash
npm run build
npm start
```

### Environment Setup for Production
Set these environment variables on your hosting platform:
- `MONGODB_URI` - Production MongoDB connection string
- `JWT_SECRET` - Strong, random JWT secret
- `NODE_ENV=production`

## Performance

- Production builds optimized with Next.js
- Static generation and incremental static regeneration
- Image optimization with sharp
- Database indexing for fast queries

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes with authentication checks
- Input validation with Zod
- CORS configuration
- Rate limiting on API endpoints
- Security headers with Helmet

## License

MIT

## Support

For issues or questions, please open an issue in the repository. - Full-Stack CRUD Application

A modern, secure, and scalable educational technology platform built with Next.js 16, MongoDB, and TypeScript.

## 🎯 Features

### Core Functionality
- ✅ **CRUD Operations**: Create, Read, Update, Delete courses and user profiles
- ✅ **User Management**: Authentication, authorization, and role-based access control
- ✅ **Course Management**: Instructors can create and manage courses with modules and lessons
- ✅ **Enrollment System**: Students can enroll in courses and track progress
- ✅ **User Profiles**: Comprehensive user profiles with avatar and bio support

### Security Features
- 🔐 **JWT Authentication**: Secure token-based authentication
- 🔐 **Password Hashing**: bcryptjs for secure password storage
- 🔐 **XSS Prevention**: Input sanitization and HTML sanitization
- 🔐 **CSRF Protection**: Secure request validation
- 🔐 **Rate Limiting**: DDoS protection with express-rate-limit
- 🔐 **Input Validation**: Comprehensive validation using Zod
- 🔐 **Secure Headers**: Security headers in HTTP responses

### Performance Optimization
- 📈 **Code Splitting**: Automatic code splitting with Next.js
- 📈 **Image Optimization**: WebP and AVIF format support
- 📈 **Caching**: Optimized caching strategies
- 📈 **Database Indexes**: Strategic indexing for query performance
- 📈 **Pagination**: Efficient data fetching with cursor-based pagination

### User Interface
- 🎨 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🎨 **Accessibility**: WCAG 2.1 compliant components
- 🎨 **Dark Mode Ready**: Theme-aware styling with next-themes
- 🎨 **Component Library**: Reusable UI components with React

## 📋 System Requirements

- Node.js 16+ 
- MongoDB 4.4+
- npm or yarn package manager

## 🚀 Getting Started

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd house-of-edtech

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/house-of-edtech
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRY=7d
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Setup

Ensure MongoDB is running and accessible. The application will automatically create necessary collections and indexes on first run.

### 4. Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Production Build

```bash
npm run build
npm start
```

## 📚 Project Structure

```
src/
├── components/          # React components
│   ├── Button.tsx
│   ├── Form.tsx
│   ├── Navbar.tsx
│   ├── CourseCard.tsx
│   └── ProtectedRoute.tsx
├── hooks/              # Custom React hooks
│   └── useAuth.tsx
├── lib/                # Core utilities and database
│   ├── models/
│   │   ├── User.ts
│   │   └── Course.ts
│   ├── mongodb.ts      # MongoDB connection
│   ├── jwt.ts          # JWT utilities
│   ├── auth.ts         # Authentication middleware
│   ├── logger.ts       # Winston logger
│   └── rateLimiter.ts  # Rate limiting
├── pages/              # Next.js pages
│   ├── api/
│   │   ├── auth/       # Authentication endpoints
│   │   ├── courses/    # Course endpoints
│   │   └── users/      # User endpoints
│   ├── auth/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── courses/        # Course pages
│   ├── dashboard.tsx
│   └── index.tsx       # Home page
├── styles/             # CSS styles
│   └── globals.css
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
    ├── validation.ts   # Input validation and sanitization
    └── response.ts     # API response helpers
```

## 🔐 Security Considerations

### Authentication & Authorization
- JWT tokens with configurable expiry
- Role-based access control (RBAC)
- Secure password hashing with bcryptjs
- Protected API routes with middleware

### Input Validation & Sanitization
- Server-side validation with Zod schemas
- XSS prevention with DOMPurify
- HTML content sanitization
- Email validation and normalization

### Network Security
- Rate limiting on sensitive endpoints
- CORS protection
- Helmet.js security headers
- HTTPS enforcement in production

### Data Protection
- MongoDB connection pooling
- Prepared statements for queries
- Error handling without exposing sensitive info
- Audit logging for sensitive operations

### Best Practices
- Environment variables for secrets
- Principle of least privilege
- Regular security updates
- Input length restrictions
- Transaction management

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### E2E Testing

```bash
# Run Playwright tests
npm run e2e

# Interactive UI mode
npm run e2e:ui
```

## 📖 API Documentation

### Authentication

#### Register
```
POST /api/auth?action=register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "role": "student"
}
```

#### Login
```
POST /api/auth?action=login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

### Courses

#### Get All Courses
```
GET /api/courses?page=1&limit=10&category=programming&level=beginner&search=react
```

#### Create Course
```
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "React Fundamentals",
  "description": "Learn React from scratch",
  "category": "web-development",
  "level": "beginner",
  "price": 49.99,
  "modules": [
    {
      "title": "Module 1",
      "description": "Introduction",
      "duration": 60,
      "lessons": []
    }
  ]
}
```

#### Get Course
```
GET /api/courses/[courseId]
```

#### Update Course
```
PUT /api/courses/[courseId]
Authorization: Bearer <token>
Content-Type: application/json
```

#### Delete Course
```
DELETE /api/courses/[courseId]
Authorization: Bearer <token>
```

#### Enroll in Course
```
POST /api/courses/[courseId]?action=enroll
Authorization: Bearer <token>
```

### Users

#### Get Current User
```
GET /api/users/me
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "bio": "Software developer",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Get User Profile
```
GET /api/users/[userId]
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRY` | Token expiration time | `7d` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `LOG_LEVEL` | Winston log level | `info` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## 📊 Database Schema

### User Schema
- name: String (required)
- email: String (unique, required)
- password: String (hashed)
- role: String (student, instructor, admin)
- bio: String (optional)
- avatar: String (optional)
- enrolledCourses: Array of Course IDs
- createdCourses: Array of Course IDs
- isVerified: Boolean
- isActive: Boolean
- lastLogin: Date

### Course Schema
- title: String (required)
- description: String (required)
- instructor: ObjectId (User reference)
- category: String (enum)
- level: String (beginner, intermediate, advanced)
- price: Number
- students: Array of User IDs
- modules: Array of Module objects
- rating: Number
- reviews: Number
- isActive: Boolean
- timestamps: createdAt, updatedAt

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: Please define the MONGODB_URI environment variable

Solution: Ensure MONGODB_URI is set in .env.local
```

### JWT Token Invalid
```
Error: Invalid or expired token

Solution: 
1. Ensure JWT_SECRET is consistent
2. Check token expiration with JWT_EXPIRY
3. Re-login to get a new token
```

### Rate Limit Exceeded
```
Error: Too many requests from this IP

Solution:
1. Wait for the rate limit window to reset
2. Adjust RATE_LIMIT_WINDOW_MS and RATE_LIMIT_MAX_REQUESTS
```

## 📈 Performance Metrics

Target performance metrics:
- Page load time: < 2 seconds
- API response time: < 500ms
- Database query time: < 100ms
- Lighthouse score: > 90

## 🚀 Deployment

### Vercel Deployment

1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Docker Deployment

```bash
# Build image
docker build -t house-of-edtech .

# Run container
docker run -p 3000:3000 -e MONGODB_URI=<uri> house-of-edtech
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## 📞 Support

For support, email support@houseofedtech.com or open an issue on GitHub.

---

Built with ❤️ using Next.js, MongoDB, and TypeScript
#   h o u s e - o f - e d t e c h - 2  
 