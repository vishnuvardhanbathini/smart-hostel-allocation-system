import os
import sys
import unittest
from app import create_app
from models import db, User, Student, Warden, Hostel, Room, Application, Allocation, Complaint, Notice, Notification

class ComprehensiveSystemAudit(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create app configured with an isolated in-memory test database
        cls.app = create_app({
            'TESTING': True,
            'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
            'WTF_CSRF_ENABLED': False,
            'SERVER_NAME': 'localhost.localdomain'
        })
        cls.app_context = cls.app.app_context()
        cls.app_context.push()

        from seed_data import seed_database
        db.create_all()
        seed_database()

    @classmethod
    def tearDownClass(cls):
        db.session.remove()
        db.drop_all()
        cls.app_context.pop()

    def setUp(self):
        self.client = self.app.test_client()

    # ========================================================
    # PHASE 1: PUBLIC PAGES & STATIC ASSETS
    # ========================================================
    def test_01_public_pages(self):
        """Test homepage, aliases, hostel detail page, and static assets"""
        # Test root and aliases
        for path in ['/', '/home', '/index', '/api', '/api/index']:
            res = self.client.get(path)
            self.assertEqual(res.status_code, 200, f"Failed accessing {path}")
            self.assertIn("Smart Hostel Allocation", res.text)
            self.assertIn("and Management System", res.text)

        # Test hostel detail page
        hostel = Hostel.query.first()
        res_h = self.client.get(f'/hostel/{hostel.id}')
        self.assertEqual(res_h.status_code, 200)
        self.assertIn(hostel.name, res_h.text)

        # Test static files exist and return 200
        css = self.client.get('/static/css/style.css')
        self.assertEqual(css.status_code, 200)
        self.assertIn('text/css', css.content_type)

        js = self.client.get('/static/js/main.js')
        self.assertEqual(js.status_code, 200)

        img = self.client.get('/static/images/hostelimage.jpg')
        self.assertEqual(img.status_code, 200)
        self.assertEqual(len(img.data), 118792)

    # ========================================================
    # PHASE 2: 1-CLICK DEMO LOGINS & PREFILLS
    # ========================================================
    def test_02_demo_logins(self):
        """Test 1-click quick logins for Admin, Warden, Student"""
        # Quick Admin
        res_admin = self.client.get('/login/quick/admin', follow_redirects=True)
        self.assertEqual(res_admin.status_code, 200)
        self.assertIn('/admin/dashboard', res_admin.request.path)

        # Quick Warden
        res_warden = self.client.get('/login/quick/warden', follow_redirects=True)
        self.assertEqual(res_warden.status_code, 200)
        self.assertIn('/warden/dashboard', res_warden.request.path)

        # Quick Student
        res_student = self.client.get('/login/quick/student', follow_redirects=True)
        self.assertEqual(res_student.status_code, 200)
        self.assertIn('/student/dashboard', res_student.request.path)

        # Pre-fill query param checks on /login
        form_admin = self.client.get('/login?role=admin')
        self.assertIn('value="admin"', form_admin.text)
        self.assertIn('value="admin123"', form_admin.text)

        # Logout
        res_logout = self.client.get('/logout', follow_redirects=True)
        self.assertEqual(res_logout.status_code, 200)
        self.assertIn('/login', res_logout.request.path)

    # ========================================================
    # PHASE 3: STUDENT REGISTRATION WORKFLOW
    # ========================================================
    def test_03_student_registration_workflow(self):
        """Test full student registration, password hashing, and login"""
        # Register new student
        reg_data = {
            'full_name': 'Test Student Quality',
            'student_id': 'TEST-STU-999',
            'username': 'test_student_qa',
            'email': 'test.qa@university.edu',
            'password': 'TestPassword123!',
            'confirm_password': 'TestPassword123!',
            'phone': '+91 99999 88888',
            'gender': 'Male',
            'department': 'Computer Science and Engineering',
            'year_of_study': 2,
            'address': 'Plot 42, University Tech Park, Hyderabad',
            'parent_name': 'Mr. Test Senior',
            'parent_phone': '+91 99999 77777',
            'emergency_contact': '+91 99999 66666'
        }
        res_reg = self.client.post('/register', data=reg_data, follow_redirects=True)
        self.assertEqual(res_reg.status_code, 200)

        # Verify DB entry
        user = User.query.filter_by(username='test_student_qa').first()
        self.assertIsNotNone(user)
        self.assertTrue(user.check_password('TestPassword123!'))
        student = Student.query.filter_by(student_id='TEST-STU-999').first()
        self.assertIsNotNone(student)
        self.assertEqual(student.user_id, user.id)

        # Test duplicate registration rejection (must logout first to access register form)
        self.client.get('/logout', follow_redirects=True)
        res_dup = self.client.post('/register', data=reg_data, follow_redirects=True)
        self.assertIn('already taken', res_dup.text.lower())

        # Test logging in with newly registered account
        res_login = self.client.post('/login', data={
            'username': 'test_student_qa',
            'password': 'TestPassword123!'
        }, follow_redirects=True)
        self.assertEqual(res_login.status_code, 200)
        self.assertIn('/student/dashboard', res_login.request.path)

    # ========================================================
    # PHASE 4: STUDENT APPLICATION & STATUS TRACKING
    # ========================================================
    def test_04_student_application_workflow(self):
        """Test submitting hostel application and tracking live status"""
        # Log in as test student
        self.client.post('/login', data={'username': 'test_student_qa', 'password': 'TestPassword123!'}, follow_redirects=True)

        # Apply for boys hostel
        boys_hostel = Hostel.query.filter_by(hostel_type='Boys').first()
        app_data = {
            'preferred_hostel_id': boys_hostel.id,
            'preferred_room_type': 'Double',
            'academic_score': 8.95,
            'distance_from_home_km': 280,
            'special_remarks': 'Prefer 2nd floor room for academic study.'
        }
        res_apply = self.client.post('/student/apply', data=app_data, follow_redirects=True)
        self.assertEqual(res_apply.status_code, 200)

        # Verify DB entry
        student = Student.query.filter_by(student_id='TEST-STU-999').first()
        app_record = Application.query.filter_by(student_id=student.id).first()
        self.assertIsNotNone(app_record)
        self.assertEqual(app_record.status, 'Pending')
        self.assertEqual(app_record.academic_score, 8.95)

        # View application status page
        res_status = self.client.get('/student/application-status')
        self.assertEqual(res_status.status_code, 200)
        self.assertIn(boys_hostel.name, res_status.text)

    # ========================================================
    # PHASE 5: ADMIN APPLICATION APPROVAL & ALLOCATION ENGINE
    # ========================================================
    def test_05_admin_management_and_allocation(self):
        """Test Admin approving application and running Smart Room Allocation engine"""
        # Log in as Admin
        self.client.get('/login/quick/admin', follow_redirects=True)

        student = Student.query.filter_by(student_id='TEST-STU-999').first()
        app_record = Application.query.filter_by(student_id=student.id).first()

        # Approve application
        res_approve = self.client.post(f'/admin/applications/{app_record.id}/approve', follow_redirects=True)
        self.assertEqual(res_approve.status_code, 200)
        db.session.refresh(app_record)
        self.assertEqual(app_record.status, 'Approved')

        # Run Smart Auto-Allocation
        alloc_count_before = Allocation.query.filter_by(status='Active').count()
        res_smart = self.client.post('/admin/smart-allocation/run', follow_redirects=True)
        self.assertEqual(res_smart.status_code, 200)

        alloc_count_after = Allocation.query.filter_by(status='Active').count()
        self.assertGreater(alloc_count_after, alloc_count_before)

        # Verify student was allocated
        db.session.refresh(app_record)
        self.assertEqual(app_record.status, 'Allocated')
        alloc = Allocation.query.filter_by(student_id=student.id, status='Active').first()
        self.assertIsNotNone(alloc)
        self.assertIsNotNone(alloc.room_id)
        self.assertIsNotNone(alloc.bed_number)

    # ========================================================
    # PHASE 6: STUDENT COMPLAINTS & WARDEN RESOLUTION
    # ========================================================
    def test_06_complaint_desk_workflow(self):
        """Test student filing complaint and assigned warden resolving it"""
        # Student files complaint
        self.client.post('/login', data={'username': 'test_student_qa', 'password': 'TestPassword123!'}, follow_redirects=True)
        comp_data = {
            'category': 'Electrical',
            'title': 'Desk study lamp socket not functioning',
            'description': 'Power outlet near bed 2 is not delivering power since this morning.'
        }
        res_comp = self.client.post('/student/complaints', data=comp_data, follow_redirects=True)
        self.assertEqual(res_comp.status_code, 200)

        student = Student.query.filter_by(student_id='TEST-STU-999').first()
        comp = Complaint.query.filter_by(student_id=student.id).first()
        self.assertIsNotNone(comp)
        self.assertEqual(comp.status, 'Pending')

        # Warden logs in to resolve complaint
        self.client.get('/login/quick/warden', follow_redirects=True)
        res_resolve = self.client.post(f'/warden/complaints/{comp.id}/update', data={
            'status': 'Resolved',
            'warden_remarks': 'Electrician inspected and replaced the 16A modular circuit socket.'
        }, follow_redirects=True)
        self.assertEqual(res_resolve.status_code, 200)

        db.session.refresh(comp)
        self.assertEqual(comp.status, 'Resolved')
        self.assertIn('Electrician inspected and replaced the 16A modular circuit socket.', comp.warden_remarks)

    # ========================================================
    # PHASE 7: ROLE-BASED ACCESS CONTROL (RBAC) SECURITY
    # ========================================================
    def test_07_rbac_security_protection(self):
        """Test unauthorized route access prevention across roles"""
        # 1. Unauthenticated guest trying to access protected dashboards
        self.client.get('/logout', follow_redirects=True)
        res_guest_admin = self.client.get('/admin/dashboard')
        self.assertEqual(res_guest_admin.status_code, 302)
        self.assertIn('/login', res_guest_admin.headers.get('Location'))

        res_guest_student = self.client.get('/student/dashboard')
        self.assertEqual(res_guest_student.status_code, 302)
        self.assertIn('/login', res_guest_student.headers.get('Location'))

        res_guest_warden = self.client.get('/warden/dashboard')
        self.assertEqual(res_guest_warden.status_code, 302)
        self.assertIn('/login', res_guest_warden.headers.get('Location'))

        # 2. Student trying to access Admin dashboard
        self.client.post('/login', data={'username': 'test_student_qa', 'password': 'TestPassword123!'}, follow_redirects=True)
        res_student_on_admin = self.client.get('/admin/dashboard', follow_redirects=True)
        # Should be denied and redirected to home
        self.assertIn('Access denied', res_student_on_admin.text)

        # 3. Warden trying to access Admin dashboard
        self.client.get('/login/quick/warden', follow_redirects=True)
        res_warden_on_admin = self.client.get('/admin/dashboard', follow_redirects=True)
        self.assertIn('Access denied', res_warden_on_admin.text)

    # ========================================================
    # PHASE 8: REPORT EXPORTS & CSV DOWNLOADS
    # ========================================================
    def test_08_reports_and_csv_exports(self):
        """Test Admin CSV downloads and report generation"""
        self.client.get('/login/quick/admin', follow_redirects=True)

        for report_type in ['occupancy', 'allocations', 'rooms']:
            res = self.client.get(f'/admin/reports/export/{report_type}')
            self.assertEqual(res.status_code, 200, f"Export {report_type} failed")
            self.assertIn('text/csv', res.content_type)
            self.assertIn('attachment;', res.headers.get('Content-Disposition', ''))

if __name__ == '__main__':
    unittest.main()
