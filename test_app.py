"""
Automated Test Suite for Smart Hostel Allocation System
Verifies:
1. Database initialization and seeding.
2. User authentication (Admin, Student, Warden).
3. Admin dashboard and statistics.
4. Smart Room Allocation Engine.
5. Student application submission.
6. Warden complaint status updates.
7. CSV report generation.
"""

from sqlalchemy.pool import StaticPool
from app import create_app
from models import db, User, Student, Warden, Hostel, Room, Application, Allocation, Complaint

def run_tests():
    print("=" * 60)
    print("STARTING SMART HOSTEL ALLOCATION SYSTEM TEST SUITE")
    print("=" * 60)

    # Use isolated in-memory test database so tests are completely repeatable and do not mutate hostel.db
    app = create_app({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'SQLALCHEMY_ENGINE_OPTIONS': {'poolclass': StaticPool}
    })
    client = app.test_client()

    with app.app_context():
        # Test 1: Verify Seed Data
        print("\n[Test 1] Verifying Database Seeding...")
        user_count = User.query.count()
        student_count = Student.query.count()
        hostel_count = Hostel.query.count()
        room_count = Room.query.count()
        alloc_count = Allocation.query.filter_by(status='Active').count()
        
        print(f"  Users: {user_count}, Students: {student_count}, Hostels: {hostel_count}, Rooms: {room_count}, Active Allocations: {alloc_count}")
        assert user_count >= 10, "Failed: Users not properly seeded"
        assert hostel_count >= 4, "Failed: Hostels not properly seeded"
        assert room_count >= 20, "Failed: Rooms not properly seeded"
        print("  [OK] Seed data verification passed!")

        # Test 2: Public Landing Page
        print("\n[Test 2] Testing Landing Page...")
        res = client.get('/')
        assert res.status_code == 200
        assert b"Smart Hostel Allocation" in res.data
        print("  [OK] Landing page accessible!")

        # Test 3: Authentication - Admin Login
        print("\n[Test 3] Testing Admin Authentication...")
        res = client.post('/login', data={'username': 'admin', 'password': 'admin123'}, follow_redirects=True)
        assert res.status_code == 200
        assert b"System Overview" in res.data or b"Dashboard" in res.data
        print("  [OK] Admin login successful and redirected to dashboard!")

        # Test 4: Admin Dashboard & Metrics
        print("\n[Test 4] Testing Admin Metrics & Views...")
        res = client.get('/admin/students')
        assert res.status_code == 200
        assert b"Rahul Sharma" in res.data
        
        res = client.get('/admin/hostels')
        assert res.status_code == 200
        assert b"SR University Boys Hostel BH-05" in res.data

        res = client.get('/admin/rooms')
        assert res.status_code == 200
        assert b"BH-101" in res.data
        print("  [OK] Admin student, hostel, and room views functioning!")

        # Test 4b: Hostel Detailed Page
        hostel_sample = Hostel.query.filter_by(name="SR University Boys Hostel BH-05").first()
        res = client.get(f'/hostel/{hostel_sample.id}')
        assert res.status_code == 200
        assert b"SR University Boys Hostel BH-05" in res.data
        assert b"High-Speed Wi-Fi" in res.data
        print("  [OK] Detailed hostel information page functioning!")

        # Test 5: Smart Room Allocation Engine
        print("\n[Test 5] Testing Smart Room Allocation Engine...")
        # Check queued candidates
        approved_before = Application.query.filter_by(status='Approved').count()
        alloc_before = Allocation.query.filter_by(status='Active').count()
        print(f"  Active allocations before smart run: {alloc_before}")
        print(f"  Approved applications in queue: {approved_before}")

        res = client.post('/admin/smart-allocation/run', data={'include_pending': 'off'}, follow_redirects=True)
        assert res.status_code == 200

        alloc_after = Allocation.query.filter_by(status='Active').count()
        print(f"  Active allocations after smart run: {alloc_after}")
        assert alloc_after > alloc_before, "Failed: Smart allocation did not allocate queued students"
        print("  [OK] Smart room allocation engine successfully matched and assigned beds!")

        # Test 6: Student Login & Application
        print("\n[Test 6] Testing Student Portal & Application...")
        client.get('/logout')
        res = client.post('/login', data={'username': 'rahul_sharma', 'password': 'student123'}, follow_redirects=True)
        assert res.status_code == 200
        assert b"Rahul Sharma" in res.data
        assert b"BH-101" in res.data  # Rahul is in room BH-101

        # Test complaints filing
        res = client.post('/student/complaints', data={
            'category': 'Electricity',
            'priority': 'Medium',
            'room_number': 'BH-101',
            'title': 'Test Light Bulb Replacement',
            'description': 'Desk reading lamp needs a new LED bulb.'
        }, follow_redirects=True)
        assert res.status_code == 200
        assert b"Complaint submitted successfully" in res.data
        print("  [OK] Student login, room view, and complaint submission passed!")

        # Test 7: Warden Portal & Complaint Resolution
        print("\n[Test 7] Testing Warden Console & Ticket Resolution...")
        client.get('/logout')
        res = client.post('/login', data={'username': 'warden_boys', 'password': 'warden123'}, follow_redirects=True)
        assert res.status_code == 200
        assert b"SR University Boys Hostel BH-05" in res.data

        # Find the latest complaint
        comp = Complaint.query.filter_by(title='Test Light Bulb Replacement').first()
        assert comp is not None
        res = client.post(f'/warden/complaints/{comp.id}/update', data={
            'status': 'Resolved',
            'warden_remarks': 'Maintenance staff replaced the LED bulb.'
        }, follow_redirects=True)
        assert res.status_code == 200

        updated_comp = db.session.get(Complaint, comp.id)
        assert updated_comp.status == 'Resolved'
        print("  [OK] Warden complaint status updated to Resolved!")

        # Test 8: Reports & CSV Export
        print("\n[Test 8] Testing Reports & CSV Exports...")
        client.get('/logout')
        client.post('/login', data={'username': 'admin', 'password': 'admin123'}, follow_redirects=True)
        
        res = client.get('/admin/reports')
        assert res.status_code == 200

        res_csv = client.get('/admin/reports/export/allocations')
        assert res_csv.status_code == 200
        assert 'text/csv' in res_csv.content_type
        assert b"Student ID" in res_csv.data
        print("  [OK] Reports and CSV downloads verified!")

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED SUCCESSFULLY! (100% OPERATIONAL)")
    print("=" * 60)

if __name__ == '__main__':
    run_tests()
