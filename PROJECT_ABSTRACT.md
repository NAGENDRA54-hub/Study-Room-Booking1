# PROJECT ABSTRACT

## 📌 PROJECT INFORMATION

**Project Name:** Study Room Booking System (SBS)  
**Project ID:** SBS-2026  
**Version:** 0.0.1 (Initial Development)  
**Created Date:** March 2026  
**Project Status:** 🟡 Active Development (Scaffolding Phase)

---

## 📋 EXECUTIVE SUMMARY

The **Study Room Booking System (SBS)** is a full-stack web application designed to automate and streamline the process of booking study rooms in academic or corporate environments. The system allows users to browse available study rooms, check real-time availability, make reservations, and manage their bookings. Administrators have additional privileges to manage room inventories, approve bookings, and generate utilization reports.

---

## 🎯 PROJECT OBJECTIVES

1. **Provide a user-friendly interface** for booking study rooms without manual contact
2. **Prevent double-booking** through real-time conflict detection
3. **Enable administrators** to efficiently manage room inventory
4. **Track room utilization** for better resource planning
5. **Ensure secure authentication** with JWT-based user authorization
6. **Support multi-role access** (Student, Administrator)

---

## 🏗️ TECHNICAL ARCHITECTURE

### **Technology Stack Overview**

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 19.2.0 | User interface and client-side logic |
| **Build Tool (Frontend)** | Vite | 7.3.1 | Fast build system and development server |
| **Backend** | Spring Boot | 4.0.3 | REST API and business logic |
| **Language (Backend)** | Java | 17 | Backend development |
| **Build Tool (Backend)** | Maven | 3.x | Dependency management and build automation |
| **Database** | MySQL | Aiven Cloud | Data persistence |
| **ORM** | Spring Data JPA | Latest | Database abstraction layer |
| **Security** | Spring Security + JWT | Latest | Authentication and authorization |
| **Styling** | Plain CSS3 | Latest | Frontend presentation |

---

## 📂 PROJECT STRUCTURE

```
TT_project/
│
├── sbs_backend/                              (Spring Boot REST API)
│   ├── pom.xml                               (Maven configuration)
│   ├── src/main/java/com/example/sbs_backend/
│   │   ├── SbsBackendApplication.java        (Application entry point)
│   │   └── controller/
│   │       └── TestController.java           (Test endpoint)
│   ├── src/main/resources/
│   │   ├── application.properties            (Database & server config)
│   │   ├── static/                           (Static resources)
│   │   └── templates/                        (HTML templates)
│   └── target/                               (Build artifacts)
│
└── sbs-frontend/                             (React + Vite frontend)
    ├── package.json                          (Node dependencies)
    ├── vite.config.js                        (Vite configuration)
    ├── src/
    │   ├── main.jsx                          (React entry point)
    │   ├── App.jsx                           (Main app component)
    │   ├── App.css                           (Component styles)
    │   ├── index.css                         (Global styles)
    │   ├── assets/                           (Images & static assets)
    │   └── index.html                        (HTML template)
    └── eslintrc.js                           (ESLint configuration)
```

---

## 🗄️ DATABASE DESIGN

**Database:** MySQL (Aiven Cloud Hosted)  
**Tables Planned:** 4 main tables + audit logs

### Table Structure (Planned but not yet created):

#### **users Table**
- Stores user login credentials and profile information
- Columns: id, email, password (hashed), full_name, role (STUDENT/ADMIN), created_at, updated_at

#### **rooms Table**
- Contains study room information
- Columns: id, name, capacity, location, price_per_hour, amenities, status, created_at, updated_at

#### **bookings Table**
- Records all room reservations with their status
- Columns: id, user_id (FK), room_id (FK), start_time, end_time, status (PENDING/CONFIRMED/COMPLETED/CANCELLED), total_price, created_at, updated_at

#### **admin_logs Table** (Optional)
- Audit trail for administrative actions
- Columns: id, admin_id (FK), action, target_type, target_id, details, created_at

**Current Status:** Tables planned but not yet created in database

---

## 🔐 SECURITY FRAMEWORK

### Authentication
- **Method:** JWT (JSON Web Tokens)
- **Token Expiry:** Short-lived access tokens (15-30 minutes)
- **Refresh Strategy:** Optional refresh tokens for extended sessions
- **Storage:** Secure httpOnly cookies or localStorage (frontend)

### Authorization
- **Role-Based Access Control (RBAC)**
  - **STUDENT:** Can view rooms, make bookings, manage own bookings
  - **ADMIN:** Full access to all operations, room management, approval workflows

### Password Security
- **Hashing:** BCrypt with salt
- **Requirements:** Minimum 8 characters with complexity rules

### API Security
- **CORS:** Configured for frontend origin only (not wildcard)
- **Input Validation:** JSR-303 annotations for data validation
- **SQL Injection Prevention:** JPA parameterized queries
- **HTTPS:** Required in production environment

---

## 📱 FRONTEND FEATURES (Current & Planned)

### Currently Implemented ✅
- React 19 framework with Vite build system
- Fetch API integration with backend
- Basic styling with CSS
- Component-based structure
- Hot module replacement (HMR) for development

### Planned Features (Phases 1-6)
- **Authentication Pages:** Login, Register, Password Reset
- **Dashboard:** Room listing with filters and search
- **Room Details:** Full room information with calendar picker
- **Booking Management:** Create, view, update, cancel bookings
- **User Profile:** Manage user information and preferences
- **Admin Panel:** Room management, booking approval, reports
- **Notifications:** Toast messages for success/error feedback
- **Pagination:** Handle large datasets efficiently
- **Search & Filter:** Advanced room search capabilities
- **Mobile Responsive:** Design for all device sizes

---

## 🔧 BACKEND SERVICES (Planned)

### Controller Layer (REST Endpoints)
```
AuthController
├── POST /api/auth/register
├── POST /api/auth/login
├── POST /api/auth/logout
└── POST /api/auth/validate-token

RoomController
├── GET /api/rooms
├── GET /api/rooms/{id}
├── POST /api/rooms (ADMIN)
├── PUT /api/rooms/{id} (ADMIN)
├── DELETE /api/rooms/{id} (ADMIN)
└── GET /api/rooms/{id}/availability

BookingController
├── POST /api/bookings
├── GET /api/bookings
├── GET /api/bookings/{id}
├── PUT /api/bookings/{id}
├── DELETE /api/bookings/{id}
└── GET /api/bookings/check-conflict

AdminController
├── GET /api/admin/bookings
├── PUT /api/admin/bookings/{id}/approve
├── PUT /api/admin/bookings/{id}/reject
└── GET /api/admin/reports/room-usage
```

### Service Layer (Business Logic)
- **AuthService:** JWT generation, user authentication, token validation
- **UserService:** User CRUD operations, validation
- **RoomService:** Room management, availability checking
- **BookingService:** Booking CRUD, conflict detection, pricing calculation
- **AdminService:** Administrative operations, reporting

### Repository Layer (Data Access)
- **UserRepository:** JPA repository for user entity
- **RoomRepository:** JPA repository for room entity
- **BookingRepository:** JPA repository for booking entity
- **AdminLogRepository:** JPA repository for audit logs

---

## 👥 USER ROLES & WORKFLOWS

### **Student User Workflow**
```
1. Register/Login
   ↓
2. View Available Rooms
   ↓
3. Check Room Availability
   ↓
4. Book a Room (Date/Time)
   ↓
5. Receive Confirmation
   ↓
6. View My Bookings
   ↓
7. Cancel Booking (if needed)
```

### **Administrator User Workflow**
```
1. Login (Admin Account)
   ↓
2. Manage Rooms (Add/Edit/Delete)
   ↓
3. View All Bookings
   ↓
4. Approve/Reject Pending Bookings
   ↓
5. View Room Utilization Reports
   ↓
6. Audit User Actions
```

---

## 🔄 KEY SYSTEM FLOWS

### User Registration & Login
- User submits email/password via frontend
- Backend validates and hashes password
- JWT token returned on successful login
- Token stored in frontend for authenticated requests

### Room Booking Process
- User selects room and dates
- System checks for conflicts in selected time slot
- If available, creates booking record with PENDING status
- Admin approves/confirms booking (optional workflow)
- User receives confirmation

### Conflict Detection
- Before creating booking, system queries bookings table
- Checks for overlapping start_time and end_time
- Returns error if conflict detected
- Only allows booking if no overlaps found

---

## 📊 PROJECT DEVELOPMENT PHASES

| Phase | Focus | Status | Estimated |
|-------|-------|--------|-----------|
| **Phase 1** | Backend Entity & Repository Layer | 🟡 In Progress | Week 1-2 |
| **Phase 2** | Backend Service & Controller Implementation | 🔴 Not Started | Week 2-3 |
| **Phase 3** | Frontend Routing & Page Structure | 🔴 Not Started | Week 3-4 |
| **Phase 4** | Frontend Components & API Integration | 🔴 Not Started | Week 4-5 |
| **Phase 5** | Testing & Bug Fixes | 🔴 Not Started | Week 5-6 |
| **Phase 6** | Deployment & Production Setup | 🔴 Not Started | Week 6-7 |

---

## 📈 DEVELOPMENT STATUS METRICS

| Component | Completion | Details |
|-----------|-----------|---------|
| **Backend Framework** | ✅ 100% | Spring Boot setup complete |
| **Frontend Framework** | ✅ 100% | React + Vite setup complete |
| **Database Connection** | ✅ 100% | MySQL Aiven connected |
| **Entity Modeling** | ❌ 0% | No entity classes yet |
| **Repository Layer** | ❌ 0% | No JPA repositories created |
| **Service Layer** | ❌ 0% | No business logic services |
| **API Endpoints** | ⚠️ 5% | Only test endpoint exists |
| **Authentication** | ❌ 0% | JWT not implemented |
| **Frontend Pages** | ⚠️ 10% | Only basic App component |
| **Routing** | ❌ 0% | React Router not installed |
| **Form Validation** | ❌ 0% | Not implemented |
| **Error Handling** | ❌ 0% | Not implemented |
| **Testing** | ❌ 0% | Unit tests not written |

**Overall Project Completion: ~15%**

---

## 🚀 DEPLOYMENT ENVIRONMENT

### Development
- **Frontend:** localhost:5173 (Vite dev server)
- **Backend:** localhost:8080 (Spring Boot)
- **Database:** Aiven Cloud MySQL

### Production (Future)
- **Frontend:** Static hosting (AWS S3, Vercel, Netlify, etc.)
- **Backend:** Cloud deployment (AWS EC2, Google Cloud, Heroku, etc.)
- **Database:** Managed MySQL service or similar
- **HTTPS:** Required for all endpoints
- **Domain:** TBD

---

## 📦 DEPENDENCIES SUMMARY

### Backend (Maven)
```
Core Framework:
- spring-boot-starter-web (v4.0.3)
- spring-boot-starter-data-jpa
- spring-boot-starter-security

Database:
- mysql-connector-j
- h2 (test)

Utilities:
- lombok

Testing:
- spring-boot-starter-test
- spring-security-test
```

### Frontend (npm)
```
Production:
- react@19.2.0
- react-dom@19.2.0

Development:
- vite@7.3.1
- @vitejs/plugin-react
- eslint@10.0.1
- eslint-plugin-react-hooks
```

---

## 🎓 LEARNING OUTCOMES

### Technologies Learned/Used
1. **Java 17** - Object-oriented backend development
2. **Spring Boot 4.0.3** - Enterprise application framework
3. **Spring Data JPA** - Database ORM layer
4. **Spring Security** - Authentication & authorization
5. **JWT/JWT Tokens** - Stateless user authentication
6. **React 19** - Modern frontend framework
7. **Vite** - Next-generation build tool
8. **REST API Design** - RESTful web service principles
9. **MySQL** - Relational database management
10. **Full-Stack Development** - End-to-end application development

---

## 📝 NEXT IMMEDIATE ACTIONS

1. **✅ Done:** Project scaffolding and architecture design
2. **⏭️ Next:** Create User, Room, Booking entity classes
3. **⏭️ Then:** Implement JPA repositories
4. **⏭️ Then:** Create JWT authentication service
5. **⏭️ Then:** Build REST API endpoints
6. **⏭️ Then:** Set up React Router and pages
7. **⏭️ Then:** Implement frontend-backend integration

---

## 💡 KEY FEATURES OVERVIEW

### For Students
- ✨ Easy booking interface
- 🔍 Search and filter rooms
- 📅 View booking history
- ❌ Cancel bookings
- 📧 Email confirmations (optional)

### For Administrators
- 👨‍💼 User management
- 🏢 Room inventory control
- 📊 Booking analytics
- ✅ Booking approval workflows
- 📋 Audit logs and reports

---

## 🔗 SYSTEM CONNECTIVITY

```
User Browser (http://localhost:5173)
        ↓
    [React App]
        ↓
    Vite Proxy (/api)
        ↓
Spring Boot Server (http://localhost:8080)
        ↓
   [REST Endpoints]
        ↓
  Spring Data JPA
        ↓
  MySQL Database
```

---

## 📄 PROJECT DOCUMENTS

- **[PROJECT_ARCHITECTURE_PROMPT.md](PROJECT_ARCHITECTURE_PROMPT.md)** - Detailed technical architecture and development roadmap
- **[PROJECT_ABSTRACT.md](PROJECT_ABSTRACT.md)** - This document
- **pom.xml** - Backend dependencies
- **package.json** - Frontend dependencies

---

## ✍️ NOTES & OBSERVATIONS

1. **Current Limitation:** Only a test endpoint exists; main CRUD operations not yet implemented
2. **Database:** MySQL is configured but no entity tables have been created yet
3. **Frontend:** React app successfully fetches from backend, proving integration works
4. **Security:** All security dependencies are included but not yet configured
5. **Scalability:** Architecture is designed to scale with additional features

---

## 📞 PROJECT CONTACTS

**Developer:** Anurag (Based on Aiven Cloud configuration)  
**Last Updated:** March 9, 2026  
**Project Location:** `c:\TT_project`

---

## 🎯 SUCCESS CRITERIA

✅ Fully functional room booking system  
✅ Secure JWT-based authentication  
✅ Conflict-free booking mechanism  
✅ User-friendly responsive UI  
✅ Admin dashboard with reports  
✅ Production-ready deployment  
✅ Comprehensive test coverage  

---

**END OF ABSTRACT**

*This document provides a comprehensive overview of the Study Room Booking System project, including its objectives, architecture, current status, and development roadmap.*
