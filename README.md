<<<<<<< HEAD
# 🏨 Smart Hostel Allocation System

An enterprise-grade, modern, and fully functional web application designed for university residential housing management, automated room allocation, real-time occupancy tracking, and student grievance redressal.

Built for **Software Engineering and System Design (SESD)** academic capstone evaluation and demonstration.

---

## 🌟 Key Highlights & Capabilities

- **Intelligent Smart Allocation Engine**: Multi-factor matching considering student gender, preferred residence hall, room configuration (Single/Double/Triple), academic merit (CGPA), and home distance. Automatically prevents double-booking and gender conflicts.
- **Role-Based Access Control (RBAC)**: Distinct, secure portal interfaces for **Admin**, **Hostel Warden**, and **Student**.
- **Visual Bed & Room Barometer**: Color-coded live matrix of rooms and beds (Vacant = Green, Partial = Amber, Full = Red) with occupancy percentage indicators.
- **End-to-End Application Pipeline**: Application submission, academic review, verification, and live visual progress stepper.
- **Digital Grievance Redressal**: Real-time ticketing for Electricity, Water, Wi-Fi, Cleaning, and Maintenance with warden resolution logging.
- **Campus Notice Board**: Targeted broadcasts for All Students, Boys Hostels, Girls Hostels, or Wardens.
- **Comprehensive Reports & Analytics**: Live audit tables with 1-click **CSV Export** and print-ready media views.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Backend** | Python 3, Flask 3.x |
| **Database & ORM** | SQLite 3, Flask-SQLAlchemy 3.x |
| **Authentication** | Werkzeug Security (PBKDF2/SHA-256 password hashing), Flask Session RBAC |
| **Frontend Framework** | HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3.3 |
| **Icons & Typography** | Font Awesome 6.5.1, Google Fonts ('Inter') |
| **Data Visualizations**| Chart.js 4.4.2 (Donut occupancy chart, room distribution bars) |

---

## 👥 Pre-Configured Demo Credentials

For quick evaluation during project demonstration, the database comes pre-seeded with realistic records:

| Role | Username | Password | Notes & Assigned Domain |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Full access across all halls, algorithms & reports |
| **Warden (Boys)** | `warden_boys` | `warden123` | Dr. Rajesh Sharma (SR University Boys Hostel BH-05) |
| **Warden (Girls)** | `warden_girls` | `warden123` | Prof. Sunita Deshmukh (SR University Girls Hostel GH-05) |
| **Student (Allocated)** | `rahul_sharma` | `student123` | Rahul Sharma (Room BH-101, SR University Boys) |
| **Student (Allocated)** | `priya_patel` | `student123` | Priya Patel (Room GH-101, SR University Girls) |
| **Student (Queued)** | `vikram_singh` | `student123` | Approved application ready for Smart Allocation |
| **Student (Fresher)** | `divya_mehta` | `student123` | Pending application awaiting Admin Review |

> *Tip: The login page includes 1-click credential autofill buttons for Admin, Warden, and Student.*

---

## 🚀 Installation & Running Locally in VS Code

### Prerequisites
- Python 3.8+ installed (3.10 / 3.11 recommended).
- Git installed (optional).

### Step 1: Open Project in VS Code
Open your terminal in VS Code (`Ctrl + ~`) and navigate to the project directory:
```bash
cd "smart_hostel_allocation"
```

### Step 2: (Optional) Create & Activate Virtual Environment
```bash
# Windows PowerShell / CMD:
python -m venv venv
venv\Scripts\activate

# macOS / Linux:
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Required Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run the Application
```bash
python app.py
```

The database (`database/hostel.db`) will be automatically created and populated with realistic sample data upon first run.

### Step 5: Open in Your Browser
Navigate to:
```
http://127.0.0.1:5000/
```

---

## 🗄️ Database Architecture

The SQLite database comprises 9 relational tables:
1. `users`: Authentication identities, password hashes, and user roles (`admin`, `student`, `warden`).
2. `students`: Academic profiles, student IDs, departments, phone, gender, and emergency contacts.
3. `wardens`: Residence hall supervisor identities, contact numbers, and office locations.
4. `hostels`: Residence buildings, hostel types (Boys/Girls/Co-ed), floors, and facilities.
5. `rooms`: Room numbers, floor levels, room types (Single/Double/Triple), capacities, bed occupancy, and semester pricing.
6. `applications`: Student accommodation requests, preferred hostels, CGPA, distance, and approval stages.
7. `allocations`: Active and historical room & bed assignments mapped to students.
8. `complaints`: Maintenance issues categorized by discipline, priority, and warden remarks.
9. `notices`: Official campus broadcast bulletins with target audience filters.
10. `notifications`: Personal system notifications delivered to user notification trays.

---

## 🎯 Testing & Demonstration Workflow

1. **Test Admin Smart Allocation**:
   - Log in as `admin` (`admin123`).
   - Go to **Smart Allocation Hub**.
   - Notice students queued in the priority list (e.g., Vikram Singh).
   - Click **Run Smart Auto-Allocation**.
   - Watch the system match gender, room preference, and assign next available beds with zero conflicts!
2. **Test Student Application & Status**:
   - Log in as `divya_mehta` or register a new student account.
   - Go to **Hostel Application** to submit preferences.
   - Switch back to Admin to Approve, or run the Smart Engine.
   - Refresh Student portal to view allocated room, roommates, and assigned warden contact.
3. **Test Complaint Management**:
   - As a student, navigate to **File Complaint** and report an issue (e.g. Wi-Fi or Electrical).
   - Log in as the respective **Warden** (`warden_boys` or `warden_girls`).
   - Open **Student Complaints**, change status to `In Progress` or `Resolved`, and add warden remarks.
   - Student receives an immediate notification in their tray.
4. **Test Reports & Exports**:
   - Under Admin, open **Reports & Analytics**.
   - Download CSV reports for Active Allocations, Hostel Occupancy, or Vacant Rooms.
   - Click **Print Formal Report** to view printable layout.

---

## 🛡️ Security Features
- **Werkzeug PBKDF2/SHA-256 password hashing**.
- **Session-level role-based route guards** (`@login_required`, `@admin_required`, `@student_required`, `@warden_required`).
- **Gender isolation checks** preventing cross-gender room assignments.
- **Atomic transactions** ensuring room capacities and occupancy numbers stay synchronized.
- **Cascading deletions & protections** against deleting hostels with active occupants.

---

## 📄 License
Academic Coursework Demonstration &bull; SESD Capstone Project &copy; 2024-2025.

=======
# smart-hostel-allocation-system
Smart Hostel Allocation and Management System using Python Flask
>>>>>>> 3e66a49e035ae41fb304bf2789aec855b469e318
