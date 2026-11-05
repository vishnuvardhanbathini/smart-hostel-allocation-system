# 🏨 Smart Hostel Allocation & Management System

> **Enterprise-grade, modern React 19 Single Page Application (SPA)** designed for university residential housing administration, automated algorithmic room allocation, live bed availability tracking, student grievance redressal, and campus broadcasting.

Built for **Software Engineering and System Design (SESD)** evaluation and production deployment.

[![React](https://img.shields.io/badge/React-19.0.0-61dafb?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Modern Architecture & Highlights

- **Pure React 19 + Vite + Tailwind CSS Architecture**: 100% decoupled client-side Single Page Application with instantaneous sub-second route transitions via `react-router-dom` v7.
- **Client-Side Persistent Demo Database (`LocalStorage`)**: Full relational schema, reactive state synchronization across tabs via `DatabaseContext` and `StorageEvent` listeners, zero server latency, and a 1-click **Reset Demo Data** tool in the navigation bar.
- **Intelligent Smart Allocation Engine**: Real-time algorithmic matching based on:
  $$\text{Composite Score} = (\text{CGPA} \times 0.6) + (\min(\frac{\text{Distance}}{100}, 10) \times 0.4)$$
  Strictly enforces gender isolation, residence preference matching, capacity availability, and bed assignment atomicity.
- **Role-Based Access Control (RBAC)**: Dedicated, protected portal interfaces for **Admin**, **Hostel Warden**, and **Student** with automated route guards and session management.
- **Visual Bed & Room Barometer**: Color-coded live matrix of rooms and individual beds (Vacant = Emerald, Partial = Amber, Full = Rose) with real-time occupancy percentages.
- **End-to-End Application Pipeline**: Online submission, eligibility scoring, approval queue, smart batch allocation, and visual progress tracking.
- **Digital Grievance Redressal**: Real-time ticketing for Electricity, Water, Wi-Fi, Cleaning, and Maintenance with Warden resolution logging.
- **Campus Notice Board**: Targeted bulletins categorized by All Students, Boys Hostels, Girls Hostels, or Wardens.
- **Live CSV Export & Print Reports**: Instant client-side CSV downloads for Student Directories, Room Inventories, and Allocations.

---

## 👥 Pre-Configured Demo Credentials

The application includes 1-click quick-login buttons on the Login page for instant demonstration:

| Role | Username | Password | Assigned Domain / Identity |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin` | `admin123` | Full access across all residence halls, room matrix & smart engine |
| **Boys Warden** | `warden_boys` | `warden123` | Dr. Rajesh Sharma (SR University Boys Hostel BH-05) |
| **Girls Warden** | `warden_girls` | `warden123` | Prof. Sunita Deshmukh (SR University Girls Hostel GH-05) |
| **Allocated Student** | `rahul_sharma` | `student123` | Rahul Sharma (Room BH-101, BH-05) |
| **Allocated Student** | `priya_patel` | `student123` | Priya Patel (Room GH-101, GH-05) |
| **Queued Student** | `vikram_singh` | `student123` | Approved application ready for smart allocation |
| **Fresher Student** | `divya_mehta` | `student123` | Pending application awaiting review |

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | React 19.0.0 | High-performance component-driven user interface |
| **Build Tool & Bundler** | Vite 6.2.0 | Next-generation ESM bundler with hot module replacement (HMR) |
| **Styling** | Tailwind CSS 3.4.17 + PostCSS | Dark navy `#071739` and neon cyan `#00d2ff` modern design system |
| **Routing** | React Router DOM v7 | Client-side routing with nested layouts and RBAC guards |
| **Icons** | Lucide React | High-clarity SVG icon system |
| **State & Persistence**| React Context + LocalStorage | Reactive relational state engine with seed automation |
| **Deployment** | Vercel SPA | Static edge hosting with SPA URL rewrites via `vercel.json` |

---

## 🚀 Running Locally

### Prerequisites
- Node.js `18.x` or higher installed
- npm `9.x` or higher installed

### Step 1: Clone the Repository
```bash
git clone https://github.com/vishnuvardhanbathini/smart-hostel-allocation-system.git
cd smart-hostel-allocation-system
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Step 4: Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

To test the production build locally:
```bash
npm run preview
```

---

## 📁 Project Structure

```text
smart_hostel_allocation/
├── public/
│   ├── favicon.svg             # Modern building SVG favicon
│   ├── favicon.ico             # Fallback ICO icon
│   └── images/
│       ├── hostelimage.jpg     # Campus hero photography
│       └── kitsboyshostel.jpg  # Residence hall photography
├── src/
│   ├── components/             # Reusable UI elements
│   │   ├── Navbar.jsx          # Responsive brand navigation & reset demo tool
│   │   ├── Footer.jsx          # Institutional footer
│   │   ├── Sidebar.jsx         # Role-tailored collapsible sidebar navigation
│   │   ├── ProtectedRoute.jsx  # Authentication route guard
│   │   ├── RoleBasedRoute.jsx  # Role authorization route guard
│   │   ├── NotificationBell.jsx# Interactive notification badge dropdown
│   │   └── StatCard.jsx        # Glassmorphic KPI metric cards
│   ├── context/
│   │   ├── AuthContext.jsx     # User authentication and session management
│   │   ├── DatabaseContext.jsx # Reactive LocalStorage state sync
│   │   └── ToastContext.jsx    # Animated notification alerts
│   ├── layouts/
│   │   ├── PublicLayout.jsx    # Public site frame (Navbar + Content + Footer)
│   │   └── DashboardLayout.jsx # Portal frame (Sidebar + Topbar + Content)
│   ├── pages/
│   │   ├── Home.jsx            # Public landing page with features & live metrics
│   │   ├── Login.jsx           # Portal login with 1-click quick-demo credentials
│   │   ├── Register.jsx        # Student registration workflow
│   │   ├── HostelDetails.jsx   # Public hostel amenities, rules & room inventory
│   │   ├── admin/              # Administrator portal pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageStudents.jsx
│   │   │   ├── ManageHostels.jsx
│   │   │   ├── ManageRooms.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── SmartAllocation.jsx
│   │   │   ├── AdminComplaints.jsx
│   │   │   ├── AdminNotices.jsx
│   │   │   └── Reports.jsx
│   │   ├── warden/             # Hostel warden portal pages
│   │   │   ├── WardenDashboard.jsx
│   │   │   ├── WardenRooms.jsx
│   │   │   ├── WardenStudents.jsx
│   │   │   ├── WardenComplaints.jsx
│   │   │   └── WardenNotices.jsx
│   │   └── student/            # Student portal pages
│   │       ├── StudentDashboard.jsx
│   │       ├── StudentProfile.jsx
│   │       ├── ApplyHostel.jsx
│   │       ├── ApplicationStatus.jsx
│   │       ├── RoomDetails.jsx
│   │       ├── StudentComplaints.jsx
│   │       ├── StudentNotices.jsx
│   │       └── Notifications.jsx
│   ├── services/
│   │   ├── authService.js      # Login verification & session storage
│   │   ├── db.js               # Relational LocalStorage CRUD database operations
│   │   ├── seedData.js         # Comprehensive demo dataset (users, hostels, rooms)
│   │   └── allocationEngine.js # Algorithmic merit & distance multi-factor allocation
│   ├── utils/
│   │   └── exportCSV.js        # Dynamic CSV generation & browser download
│   ├── styles/
│   │   └── index.css           # Tailwind directives & glassmorphic custom utilities
│   ├── App.jsx                 # App routing definition (22 routes)
│   └── main.jsx                # Application root entry point
├── index.html                  # HTML5 SPA container
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite bundler configuration
├── tailwind.config.js          # Tailwind custom palette & styling rules
├── postcss.config.js           # PostCSS autoprefixer plugins
└── vercel.json                 # Vercel SPA routing rewrite configuration
```

---

## 🎯 Guided Demonstration & Testing Workflows

### 1. Smart Room Allocation Engine
1. Log in as **Admin** using the 1-click `Admin` button or credentials (`admin` / `admin123`).
2. Navigate to **Smart Allocation** in the sidebar.
3. Review queued approved students (e.g. Vikram Singh, CGPA 8.4, Distance 340km).
4. Click **Run Smart Auto-Allocation**.
5. Observe the automated bed assignment matching gender, capacity, and preference with zero race conditions!

### 2. Student Application Pipeline
1. Log in as **Student** (`divya_mehta` / `student123`).
2. Go to **Application Status** to monitor real-time approval stages.
3. Apply for accommodation or switch rooms from **Apply Hostel**.
4. Log back in as **Admin** -> **Applications** to Approve or Reject with instant status updates.

### 3. Grievance Redressal System
1. As student **Rahul Sharma**, go to **Complaints** and file a maintenance request.
2. Log in as **Warden** (`warden_boys` / `warden123`).
3. Open **Complaints**, inspect the issue, change status to `In Progress` or `Resolved`, and add resolution remarks.
4. Rahul receives a real-time notification alert in his notification tray.

### 4. Data Export & Reports
1. Under Admin, navigate to **Reports & Analytics**.
2. Click **Export CSV** on Students Directory, Active Allocations, or Room Inventory.
3. The browser instantly downloads clean, formatted `.csv` spreadsheets.

---

## 🔌 Connecting Supabase in the Future

The application is architected with a decoupled `src/services/` layer (`db.js`, `authService.js`). To swap out the client demo database for Supabase PostgreSQL:
1. Install `@supabase/supabase-js`.
2. Configure environment variables in `.env`:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Update `src/services/db.js` and `src/services/authService.js` to execute queries using `supabase.from('...')` instead of `localStorage`. The React component interfaces remain identical!

---

## 📄 License
Academic Coursework Demonstration &bull; SESD Capstone Project &copy; 2024-2026.
