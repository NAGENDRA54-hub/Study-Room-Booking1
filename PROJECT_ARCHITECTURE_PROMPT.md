# Study Room Booking System (SBS) - Development Prompt & Architecture Guide

## 📋 Project Overview
**Project Name:** Study Room Booking System (SBS)  
**Type:** Full-Stack Web Application  
**Tech Stack:** React 19 + Vite (Frontend) | Spring Boot 4.0.3 (Backend) | MySQL (Database)

---

## 🎯 Project Vision & User Stories

### Primary Users
1. **Students/Visitors** - Can browse, book, and manage room bookings
2. **Administrators** - Can manage rooms, view bookings, handle cancellations

### Core Functionality

#### 1. **Authentication & Authorization**
- User Registration (email, password, name)
- Email/Password Login with JWT tokens
- Role-based access (STUDENT, ADMIN)
- Logout functionality
- Token-based session management

#### 2. **Room Management**
- View available study rooms with details (capacity, location, amenities, hourly rate)
- Search/filter rooms by capacity, location, availability
- Admin ability to add/edit/delete rooms
- Real-time availability checking

#### 3. **Booking Management**
- Create bookings for available time slots
- View personal booking history
- Cancel upcoming bookings
- Automatic status updates (PENDING → CONFIRMED → COMPLETED → CANCELLED)
- Prevent double-booking (time conflict detection)

#### 4. **Admin Features**
- Dashboard showing all bookings and room utilization
- Approve/reject/cancel bookings
- Generate reports on room usage

---

## 🗄️ Database Design (MySQL)

### Table Schema

#### **users**
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ADMIN') DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### **rooms**
```sql
CREATE TABLE rooms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    location VARCHAR(255),
    price_per_hour DECIMAL(10, 2),
    amenities VARCHAR(500),
    status ENUM('ACTIVE', 'INACTIVE', 'MAINTENANCE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### **bookings**
```sql
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    KEY idx_user (user_id),
    KEY idx_room (room_id),
    KEY idx_status (status)
);
```

#### **admin_logs** (Optional - for audit trail)
```sql
CREATE TABLE admin_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    admin_id BIGINT NOT NULL,
    action VARCHAR(255),
    target_type VARCHAR(100),
    target_id BIGINT,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔧 Backend Architecture (Spring Boot)

### Entity Layer
```
Entity Classes (JPA Models):
├── User.java              (User entity with @Entity, roles)
├── Room.java              (Room entity with details)
├── Booking.java           (Booking entity with relationships)
└── AdminLog.java          (Audit log entity)
```

### Repository Layer
```
JPA Repository Interfaces:
├── UserRepository         extends JpaRepository<User, Long>
├── RoomRepository         extends JpaRepository<Room, Long>
├── BookingRepository      extends JpaRepository<Booking, Long>
└── AdminLogRepository     extends JpaRepository<AdminLog, Long>
```

### Service Layer
```
Business Logic Services:
├── AuthService            (JWT generation, authentication)
├── UserService            (User CRUD, validation)
├── RoomService            (Room management, availability check)
├── BookingService         (Booking CRUD, conflict detection)
└── AdminService           (Admin operations, reports)
```

### Controller Layer
```
REST API Endpoints:
├── AuthController
│   ├── POST /api/auth/register
│   ├── POST /api/auth/login
│   ├── POST /api/auth/logout
│   └── POST /api/auth/validate-token
│
├── RoomController
│   ├── GET /api/rooms (list all)
│   ├── GET /api/rooms/{id} (get one)
│   ├── POST /api/rooms (create - ADMIN only)
│   ├── PUT /api/rooms/{id} (update - ADMIN only)
│   ├── DELETE /api/rooms/{id} (delete - ADMIN only)
│   └── GET /api/rooms/{id}/availability?date=YYYY-MM-DD
│
├── BookingController
│   ├── POST /api/bookings (create)
│   ├── GET /api/bookings (user's bookings)
│   ├── GET /api/bookings/{id}
│   ├── PUT /api/bookings/{id} (update)
│   ├── DELETE /api/bookings/{id} (cancel)
│   └── GET /api/bookings/check-conflict (conflict checking)
│
└── AdminController
    ├── GET /api/admin/bookings (all bookings)
    ├── PUT /api/admin/bookings/{id}/approve
    ├── PUT /api/admin/bookings/{id}/reject
    └── GET /api/admin/reports/room-usage
```

### Security Configuration
```
SecurityConfig.java:
├── JWT Token Provider (generation, validation, extraction)
├── Custom JWT Filter (request validation)
├── Spring Security Config (enable CORS, set auth rules)
├── Password Encoder (BCrypt)
└── Exception Handler (return proper HTTP error responses)
```

---

## ⚛️ Frontend Architecture (React + Vite)

### Page Components
```
├── LoginPage.jsx          (User login form)
├── RegisterPage.jsx       (User registration form)
├── DashboardPage.jsx      (List available rooms)
├── RoomDetailsPage.jsx    (Room info + booking form)
├── MyBookingsPage.jsx     (User's booking history)
└── AdminPanelPage.jsx     (Admin dashboard - optional)
```

### Feature Components
```
├── components/
│   ├── RoomCard.jsx       (Display room summary)
│   ├── BookingForm.jsx    (Date/time picker + book)
│   ├── BookingList.jsx    (Show user's bookings)
│   ├── NavBar.jsx         (Navigation + logout)
│   └── ProtectedRoute.jsx (JWT auth guard)
```

### Services/Utilities
```
├── services/
│   ├── api.js             (Axios/Fetch with interceptors for JWT)
│   └── authService.js     (Login, register, token manage)
│
└── hooks/
    ├── useAuth.js         (Auth context hook)
    └── useFetch.js        (API call wrapper)
```

### Routing
```
App.jsx Router:
├── / → LoginPage
├── /register → RegisterPage
├── /dashboard → DashboardPage (protected)
├── /rooms/:id → RoomDetailsPage (protected)
├── /my-bookings → MyBookingsPage (protected)
└── /admin → AdminPanelPage (protected, ADMIN role check)
```

---

## 🔐 Security Considerations

1. **JWT Authentication**
   - Access tokens with short expiry (15-30 minutes)
   - Refresh tokens (optional) for long-lived sessions
   - Token stored in secure httpOnly cookies or localStorage

2. **Password Security**
   - BCrypt hashing with salt (on backend)
   - Min 8 characters, complexity rules

3. **Authorization**
   - Role-based access control (RBAC)
   - Check user roles before returning sensitive data

4. **API Security**
   - CORS properly configured (frontend origin only, not *)
   - Input validation and sanitization
   - SQL injection prevention via JPA parameterized queries
   - Rate limiting (optional for production)

5. **Data Protection**
   - HTTPS only (in production)
   - Proper error messages (no sensitive info leaks)
   - Audit logging for admin actions

---

## 🔄 System Flow Diagrams

### User Registration & Login Flow
```
1. User visits /register
   ↓
2. Fills email, password, name
   ↓
3. Frontend POST to /api/auth/register
   ↓
4. Backend validates, hashes password, saves to DB
   ↓
5. Returns success message
   ↓
6. User redirected to /login
   ↓
7. User enters credentials
   ↓
8. Frontend POST to /api/auth/login
   ↓
9. Backend verifies credentials
   ↓
10. Backend generates JWT token
   ↓
11. Returns JWT token to frontend
   ↓
12. Frontend stores token, redirects to /dashboard
```

### Room Booking Flow
```
1. User visits /dashboard
   ↓
2. Frontend GET /api/rooms (list all)
   ↓
3. Show room cards with availability indicators
   ↓
4. User clicks on room → /rooms/:id
   ↓
5. Frontend GET /api/rooms/:id (detailed info)
   ↓
6. Show calendar/time picker
   ↓
7. User selects start_time & end_time
   ↓
8. Frontend POST /api/bookings/check-conflict
   ↓
9. Backend checks for overlaps in DB
   ↓
10. If available, user confirms booking
    ↓
11. Frontend POST /api/bookings with JWT token
    ↓
12. Backend validates user, creates booking record
    ↓
13. Returns booking confirmation
    ↓
14. Frontend shows success, adds to /my-bookings
```

### Admin Approval Flow (Optional)
```
1. Admin views /admin dashboard
   ↓
2. GET /api/admin/bookings?status=PENDING
   ↓
3. Shows pending bookings
   ↓
4. Admin clicks approve/reject
   ↓
5. PUT /api/admin/bookings/:id/approve
   ↓
6. Backend updates status, logs action
   ↓
7. Frontend updates display
```

---

## 📊 Development Phases

### **Phase 1: Backend Setup (Current)**
- [x] Spring Boot + MySQL configured
- [ ] Create entity classes (User, Room, Booking)
- [ ] Create repositories
- [ ] Implement AuthService with JWT
- [ ] Create AuthController endpoints
- [ ] Basic Spring Security setup

### **Phase 2: Core API**
- [ ] RoomService + RoomController (CRUD)
- [ ] BookingService + BookingController (CRUD)
- [ ] Conflict detection logic
- [ ] Input validation layer
- [ ] Global exception handler

### **Phase 3: Frontend Setup**
- [ ] Add React Router for navigation
- [ ] Create LoginPage & RegisterPage
- [ ] Implement AuthService with JWT storage
- [ ] Create API interceptor for JWT in requests

### **Phase 4: Core Frontend Features**
- [ ] Create DashboardPage with room listing
- [ ] Create RoomDetailsPage with calendar picker
- [ ] Create MyBookingsPage
- [ ] Implement booking flow

### **Phase 5: Enhancement**
- [ ] Admin Panel
- [ ] Reporting/Analytics
- [ ] Email notifications (optional)
- [ ] Payment integration (optional)

### **Phase 6: Testing & Deployment**
- [ ] Unit tests (JUnit + Mockito for backend)
- [ ] Integration tests
- [ ] E2E testing (Cypress/Playwright for frontend)
- [ ] Deploy to production

---

## 🛠️ Technology Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 19.2.0 |
| Frontend Build | Vite | 7.3.1 |
| Backend | Spring Boot | 4.0.3 |
| Backend Language | Java | 17 |
| Database | MySQL | (Aiven Cloud) |
| ORM | Spring Data JPA | (Spring Boot included) |
| Security | Spring Security | (Spring Boot included) |
| Authentication | JWT | Custom Implementation |
| HTTP Client (Frontend) | Fetch API or Axios | (To be added) |
| CSS Framework | Plain CSS (or add Bootstrap/Tailwind) | - |

---

## 📝 Implementation Checklist

### Backend TODO
- [ ] Create User entity with @Entity, constructors, getters/setters
- [ ] Create Room entity
- [ ] Create Booking entity
- [ ] Create UserRepository
- [ ] Create RoomRepository
- [ ] Create BookingRepository
- [ ] Create JWT utility class (TokenProvider)
- [ ] Create JWT filter for request validation
- [ ] Create AuthService class
- [ ] Create UserService class
- [ ] Create RoomService class
- [ ] Create BookingService class
- [ ] Create AuthController with register/login endpoints
- [ ] Create RoomController with CRUD endpoints
- [ ] Create BookingController with CRUD endpoints
- [ ] Create GlobalExceptionHandler for error responses
- [ ] Create SecurityConfig for Spring Security
- [ ] Add input validation (JSR-303 @Valid annotations)
- [ ] Test all endpoints with Postman/curl
- [ ] Add API documentation (Swagger/OpenAPI optional)

### Frontend TODO
- [ ] Install react-router-dom for routing
- [ ] Create Router structure in App.jsx
- [ ] Create LoginPage.jsx with form
- [ ] Create RegisterPage.jsx with form
- [ ] Create AuthContext for global auth state
- [ ] Create api.js with interceptor for JWT
- [ ] Create ProtectedRoute.jsx component
- [ ] Create DashboardPage.jsx with room list
- [ ] Create RoomDetailsPage.jsx with booking form
- [ ] Create MyBookingsPage.jsx with booking list
- [ ] Create NavBar.jsx with navigation
- [ ] Implement logout functionality
- [ ] Add form validation
- [ ] Add error/success toast notifications
- [ ] Style all pages (CSS or Tailwind)

---

## 🚀 Next Immediate Steps

1. **Backend**: Start with Entity classes and Repositories
2. **Backend**: Implement JWT-based AuthService
3. **Backend**: Create AuthController endpoints
4. **Frontend**: Add React Router and basic pages
5. **Frontend**: Create API service with JWT handling
6. **Test**: Use Postman to test backend endpoints

---

## 📚 Useful Resources

- [Spring Boot REST API Guide](https://spring.io/guides/gs/rest-service/)
- [Spring Security & JWT](https://spring.io/blog/2015/06/08/cors-in-spring-framework)
- [React Router Documentation](https://reactrouter.com/)
- [Fetch API vs Axios](https://www.npmjs.com/package/axios)
- [MySQL Date/Time Best Practices](https://dev.mysql.com/doc/)

---

**Project Status:** 🟡 In Scaffolding Phase  
**Last Updated:** March 9, 2026  
**Next Review:** After implementing Backend Phase 1-2
