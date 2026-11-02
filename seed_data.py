from datetime import datetime, timedelta
from models import db, User, Student, Warden, Hostel, Room, Application, Allocation, Complaint, Notice, Notification

def seed_database():
    # Only seed if no User exists
    if User.query.first():
        print("Database already contains data. Skipping initial seeding.")
        return

    print("Seeding database with realistic sample data for university hostel...")

    # 1. Admin Account
    admin_user = User(
        username='admin',
        email='admin@university.edu',
        role='admin'
    )
    admin_user.set_password('admin123')
    db.session.add(admin_user)
    db.session.flush()

    # 2. Hostels (Updated 4 university residence halls)
    hostel1 = Hostel(
        name="SR University Boys Hostel BH-05",
        hostel_type="Boys",
        total_floors=3,
        description="Comfortable and secure hostel accommodation for male students of SR University, providing a student-friendly living environment.",
        facilities="High-Speed Wi-Fi, Study Lounge, Gym",
        image_url="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
    )

    hostel2 = Hostel(
        name="SR University Girls Hostel GH-05",
        hostel_type="Girls",
        total_floors=3,
        description="Safe, comfortable, and well-maintained residential accommodation for female students at SR University.",
        facilities="High-Speed Wi-Fi, Security, Study Lounge",
        image_url="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80"
    )

    hostel3 = Hostel(
        name="Sumathi Reddy Girls Hostel",
        hostel_type="Girls",
        total_floors=2,
        description="A comfortable and secure residential facility for female students, providing a peaceful environment for academic and personal development.",
        facilities="Wi-Fi, Reading Room, Dining Hall",
        image_url="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
    )

    hostel4 = Hostel(
        name="KITS Boys Hostel",
        hostel_type="Boys",
        total_floors=2,
        description="Student accommodation for male students of Kakatiya Institute of Technology and Science, providing essential residential facilities and a convenient study environment.",
        facilities="Wi-Fi, Study Area, Dining Hall",
        image_url="/static/images/kitsboyshostel.jpg"
    )

    db.session.add_all([hostel1, hostel2, hostel3, hostel4])
    db.session.flush()

    # 3. Wardens
    warden_user1 = User(
        username='warden_boys',
        email='warden.boys@university.edu',
        role='warden'
    )
    warden_user1.set_password('warden123')
    db.session.add(warden_user1)
    db.session.flush()

    warden1 = Warden(
        user_id=warden_user1.id,
        warden_id='WRD-B-101',
        full_name='Dr. Rajesh Sharma',
        email='warden.boys@university.edu',
        phone='+91 98765 43210',
        hostel_id=hostel1.id,
        office_location='Ground Floor, Admin Wing, SR University Boys Hostel BH-05'
    )
    db.session.add(warden1)

    warden_user2 = User(
        username='warden_girls',
        email='warden.girls@university.edu',
        role='warden'
    )
    warden_user2.set_password('warden123')
    db.session.add(warden_user2)
    db.session.flush()

    warden2 = Warden(
        user_id=warden_user2.id,
        warden_id='WRD-G-201',
        full_name='Prof. Sunita Deshmukh',
        email='warden.girls@university.edu',
        phone='+91 98765 43211',
        hostel_id=hostel2.id,
        office_location='Block A, Ground Floor, SR University Girls Hostel GH-05'
    )
    db.session.add(warden2)

    # 4. Rooms creation
    rooms_data = [
        # SR University Boys Hostel BH-05 (Hostel 1)
        # Floor 1
        (hostel1.id, 'BH-101', 1, 'Double', 2, 18000.0, 'Attached Bath, Balcony, Study Desk'),
        (hostel1.id, 'BH-102', 1, 'Double', 2, 18000.0, 'Attached Bath, Study Desk'),
        (hostel1.id, 'BH-103', 1, 'Triple', 3, 14000.0, 'Spacious, Balcony, Wardrobes'),
        (hostel1.id, 'BH-104', 1, 'Single', 1, 24000.0, 'Attached Bath, AC, Balcony'),
        # Floor 2
        (hostel1.id, 'BH-201', 2, 'Double', 2, 18000.0, 'Attached Bath, High Floor View'),
        (hostel1.id, 'BH-202', 2, 'Double', 2, 18000.0, 'Study Desks, Wardrobes'),
        (hostel1.id, 'BH-203', 2, 'Triple', 3, 14000.0, 'Balcony, Attached Washroom'),
        (hostel1.id, 'BH-204', 2, 'Single', 1, 24000.0, 'Single Occupancy, Study Area'),
        # Floor 3
        (hostel1.id, 'BH-301', 3, 'Double', 2, 18000.0, 'Top Floor, Quiet Wing'),
        (hostel1.id, 'BH-302', 3, 'Triple', 3, 14000.0, 'Spacious Triple, Balcony'),

        # SR University Girls Hostel GH-05 (Hostel 2)
        # Floor 1
        (hostel2.id, 'GH-101', 1, 'Double', 2, 18000.0, 'Garden View, Attached Bath'),
        (hostel2.id, 'GH-102', 1, 'Double', 2, 18000.0, 'Attached Bath, Balcony'),
        (hostel2.id, 'GH-103', 1, 'Triple', 3, 14000.0, 'Spacious, Built-in Wardrobes'),
        (hostel2.id, 'GH-104', 1, 'Single', 1, 24000.0, 'Quiet Single, Garden Facing'),
        # Floor 2
        (hostel2.id, 'GH-201', 2, 'Double', 2, 18000.0, 'Attached Bath, Balcony'),
        (hostel2.id, 'GH-202', 2, 'Double', 2, 18000.0, 'Dual Study Stations'),
        (hostel2.id, 'GH-203', 2, 'Triple', 3, 14000.0, 'Spacious Triple, Large Balcony'),
        # Floor 3
        (hostel2.id, 'GH-301', 3, 'Double', 2, 18000.0, 'Terrace Access, Quiet'),
        (hostel2.id, 'GH-302', 3, 'Single', 1, 24000.0, 'Attached Bath, Private Balcony'),

        # Sumathi Reddy Girls Hostel (Hostel 3)
        (hostel3.id, 'SRG-101', 1, 'Single', 1, 26000.0, 'Reading Desk, High Speed Wi-Fi, Garden Facing'),
        (hostel3.id, 'SRG-102', 1, 'Double', 2, 20000.0, 'Attached Bath, Dual Wardrobes'),
        (hostel3.id, 'SRG-103', 1, 'Triple', 3, 15000.0, 'Spacious Triple, Quiet Floor'),
        (hostel3.id, 'SRG-201', 2, 'Single', 1, 26000.0, 'Private Balcony, Attached Washroom'),
        (hostel3.id, 'SRG-202', 2, 'Double', 2, 20000.0, 'Dual Study Desks, Balcony'),

        # KITS Boys Hostel (Hostel 4)
        (hostel4.id, 'KB-101', 1, 'Single', 1, 24000.0, 'Attached Bath, Wi-Fi, Ergonomic Desk'),
        (hostel4.id, 'KB-102', 1, 'Double', 2, 18000.0, 'Balcony, Dual Desks, Study Area'),
        (hostel4.id, 'KB-103', 1, 'Triple', 3, 14000.0, 'Spacious Room, Attached Bath'),
        (hostel4.id, 'KB-201', 2, 'Single', 1, 24000.0, 'Top Floor View, High-Speed Wi-Fi'),
        (hostel4.id, 'KB-202', 2, 'Double', 2, 18000.0, 'Spacious Wardrobes, Balcony')
    ]

    rooms_dict = {}
    for h_id, r_num, flr, r_type, cap, price, fac in rooms_data:
        room = Room(
            hostel_id=h_id,
            room_number=r_num,
            floor=flr,
            room_type=r_type,
            capacity=cap,
            occupied_beds=0,
            price_per_semester=price,
            facilities=fac,
            status='Available'
        )
        db.session.add(room)
        rooms_dict[r_num] = room

    db.session.flush()

    # 5. Sample Students
    students_data = [
        # (username, full_name, student_id, email, phone, gender, dept, year, address, parent_name, parent_phone)
        ('rahul_sharma', 'Rahul Sharma', 'STU2024001', 'rahul.s@university.edu', '+91 98111 22334', 'Male', 'Computer Science and Engineering', 3, 'B-42 Civil Lines, Jaipur, Rajasthan', 'Virendra Sharma', '+91 98111 99887'),
        ('priya_patel', 'Priya Patel', 'STU2024002', 'priya.p@university.edu', '+91 98222 33445', 'Female', 'Information Technology', 2, '12 Navrangpura, Ahmedabad, Gujarat', 'Kirit Patel', '+91 98222 88776'),
        ('arjun_verma', 'Arjun Verma', 'STU2024003', 'arjun.v@university.edu', '+91 98333 44556', 'Male', 'Mechanical Engineering', 3, '78 Gomti Nagar, Lucknow, UP', 'Sanjay Verma', '+91 98333 77665'),
        ('ananya_iyer', 'Ananya Iyer', 'STU2024004', 'ananya.i@university.edu', '+91 98444 55667', 'Female', 'Electronics and Communication', 1, '23 Indiranagar, Bengaluru, Karnataka', 'R. Subramaniam Iyer', '+91 98444 66554'),
        ('rohit_nair', 'Rohit Nair', 'STU2024005', 'rohit.n@university.edu', '+91 98555 66778', 'Male', 'Civil Engineering', 2, '45 Marine Drive, Kochi, Kerala', 'Mohan Nair', '+91 98555 55443'),
        ('sneha_kulkarni', 'Sneha Kulkarni', 'STU2024006', 'sneha.k@university.edu', '+91 98666 77889', 'Female', 'Computer Science and Engineering', 4, '88 Kothrud, Pune, Maharashtra', 'Anand Kulkarni', '+91 98666 44332'),
        ('vikram_singh', 'Vikram Singh', 'STU2024007', 'vikram.s@university.edu', '+91 98777 88990', 'Male', 'Electrical Engineering', 1, '10 Raja Park, Jaipur, Rajasthan', 'Col. R. S. Singh', '+91 98777 33221'),
        ('kavya_reddy', 'Kavya Reddy', 'STU2024008', 'kavya.r@university.edu', '+91 98888 99001', 'Female', 'Biotechnology', 2, '67 Jubilee Hills, Hyderabad, Telangana', 'Suresh Reddy', '+91 98888 22110'),
        ('aditya_joshi', 'Aditya Joshi', 'STU2024009', 'aditya.j@university.edu', '+91 98999 11223', 'Male', 'Computer Science and Engineering', 4, '90 Shivaji Park, Mumbai, Maharashtra', 'Prakash Joshi', '+91 98999 11009'),
        ('divya_mehta', 'Divya Mehta', 'STU2024010', 'divya.m@university.edu', '+91 98123 45678', 'Female', 'Artificial Intelligence & Data Science', 1, '5 Sector 14, Chandigarh', 'Dinesh Mehta', '+91 98123 98765'),
        ('tanmay_bhatia', 'Tanmay Bhatia', 'STU2024011', 'tanmay.b@university.edu', '+91 98234 56789', 'Male', 'Information Technology', 1, '14 Model Town, Delhi', 'Harish Bhatia', '+91 98234 87654'),
        ('meera_sen', 'Meera Sen', 'STU2024012', 'meera.s@university.edu', '+91 98345 67890', 'Female', 'Computer Science and Engineering', 3, '3 Salt Lake City, Kolkata, West Bengal', 'Subhash Sen', '+91 98345 76543')
    ]

    students_map = {}
    for uname, fname, sid, email, ph, gnd, dept, yr, addr, pname, pphone in students_data:
        u = User(username=uname, email=email, role='student')
        u.set_password('student123')
        db.session.add(u)
        db.session.flush()

        stu = Student(
            user_id=u.id,
            student_id=sid,
            full_name=fname,
            email=email,
            phone=ph,
            gender=gnd,
            department=dept,
            year_of_study=yr,
            address=addr,
            parent_name=pname,
            parent_phone=pphone,
            emergency_contact=pphone
        )
        db.session.add(stu)
        students_map[uname] = (stu, u)

    db.session.flush()

    # 6. Allocations for some students (to showcase active occupancy)
    # Rahul Sharma & Arjun Verma in SR University Boys Hostel BH-05 room BH-101 (Double room)
    stu_rahul = students_map['rahul_sharma'][0]
    stu_arjun = students_map['arjun_verma'][0]
    room_bh101 = rooms_dict['BH-101']
    
    room_bh101.occupied_beds = 2
    room_bh101.status = 'Full'
    alloc1 = Allocation(
        student_id=stu_rahul.id,
        room_id=room_bh101.id,
        hostel_id=hostel1.id,
        bed_number='Bed-1',
        academic_year='2024-2025',
        status='Active',
        allocated_by_id=admin_user.id
    )
    alloc2 = Allocation(
        student_id=stu_arjun.id,
        room_id=room_bh101.id,
        hostel_id=hostel1.id,
        bed_number='Bed-2',
        academic_year='2024-2025',
        status='Active',
        allocated_by_id=admin_user.id
    )
    db.session.add_all([alloc1, alloc2])

    # Priya Patel & Ananya Iyer in SR University Girls Hostel GH-05 room GH-101 (Double room)
    stu_priya = students_map['priya_patel'][0]
    stu_ananya = students_map['ananya_iyer'][0]
    room_gh101 = rooms_dict['GH-101']
    room_gh101.occupied_beds = 2
    room_gh101.status = 'Full'
    alloc3 = Allocation(
        student_id=stu_priya.id,
        room_id=room_gh101.id,
        hostel_id=hostel2.id,
        bed_number='Bed-1',
        academic_year='2024-2025',
        status='Active',
        allocated_by_id=admin_user.id
    )
    alloc4 = Allocation(
        student_id=stu_ananya.id,
        room_id=room_gh101.id,
        hostel_id=hostel2.id,
        bed_number='Bed-2',
        academic_year='2024-2025',
        status='Active',
        allocated_by_id=admin_user.id
    )
    db.session.add_all([alloc3, alloc4])

    # Sneha Kulkarni in Sumathi Reddy Girls Hostel SRG-101 (Single room)
    stu_sneha = students_map['sneha_kulkarni'][0]
    room_srg101 = rooms_dict['SRG-101']
    room_srg101.occupied_beds = 1
    room_srg101.status = 'Full'
    alloc5 = Allocation(
        student_id=stu_sneha.id,
        room_id=room_srg101.id,
        hostel_id=hostel3.id,
        bed_number='Bed-1',
        academic_year='2024-2025',
        status='Active',
        allocated_by_id=admin_user.id
    )
    db.session.add(alloc5)

    # Rohit Nair in SR University Boys Hostel BH-05 room BH-102 (Double room, 1 occupied)
    stu_rohit = students_map['rohit_nair'][0]
    room_bh102 = rooms_dict['BH-102']
    room_bh102.occupied_beds = 1
    room_bh102.status = 'Partially Occupied'
    alloc6 = Allocation(
        student_id=stu_rohit.id,
        room_id=room_bh102.id,
        hostel_id=hostel1.id,
        bed_number='Bed-1',
        academic_year='2024-2025',
        status='Active',
        allocated_by_id=admin_user.id
    )
    db.session.add(alloc6)

    # 7. Applications
    # 7.1 Applications for already allocated students (marked 'Allocated')
    app_rahul = Application(
        student_id=stu_rahul.id,
        preferred_hostel_id=hostel1.id,
        preferred_room_type='Double',
        academic_score=8.85,
        distance_from_home_km=280.0,
        special_remarks='Request room near library wing.',
        status='Allocated',
        admin_remarks='Allocated to SR University Boys Hostel BH-05 Room BH-101 Bed-1',
        applied_at=datetime.utcnow() - timedelta(days=20),
        reviewed_at=datetime.utcnow() - timedelta(days=18)
    )
    app_priya = Application(
        student_id=stu_priya.id,
        preferred_hostel_id=hostel2.id,
        preferred_room_type='Double',
        academic_score=9.12,
        distance_from_home_km=450.0,
        special_remarks='Prefers quiet wing for research.',
        status='Allocated',
        admin_remarks='Allocated to SR University Girls Hostel GH-05 Room GH-101 Bed-1',
        applied_at=datetime.utcnow() - timedelta(days=22),
        reviewed_at=datetime.utcnow() - timedelta(days=19)
    )
    app_arjun = Application(
        student_id=stu_arjun.id,
        preferred_hostel_id=hostel1.id,
        preferred_room_type='Double',
        academic_score=8.40,
        distance_from_home_km=320.0,
        special_remarks='',
        status='Allocated',
        admin_remarks='Allocated to SR University Boys Hostel BH-05 Room BH-101 Bed-2',
        applied_at=datetime.utcnow() - timedelta(days=19),
        reviewed_at=datetime.utcnow() - timedelta(days=18)
    )
    app_ananya = Application(
        student_id=stu_ananya.id,
        preferred_hostel_id=hostel2.id,
        preferred_room_type='Double',
        academic_score=9.45,
        distance_from_home_km=600.0,
        special_remarks='First-year student scholarship recipient',
        status='Allocated',
        admin_remarks='Allocated to SR University Girls Hostel GH-05 Room GH-101 Bed-2',
        applied_at=datetime.utcnow() - timedelta(days=25),
        reviewed_at=datetime.utcnow() - timedelta(days=19)
    )
    app_sneha = Application(
        student_id=stu_sneha.id,
        preferred_hostel_id=hostel3.id,
        preferred_room_type='Single',
        academic_score=9.60,
        distance_from_home_km=310.0,
        special_remarks='Final-year thesis work requires quiet single room.',
        status='Allocated',
        admin_remarks='Allocated to Sumathi Reddy Girls Hostel Room SRG-101',
        applied_at=datetime.utcnow() - timedelta(days=15),
        reviewed_at=datetime.utcnow() - timedelta(days=14)
    )
    app_rohit = Application(
        student_id=stu_rohit.id,
        preferred_hostel_id=hostel1.id,
        preferred_room_type='Double',
        academic_score=8.10,
        distance_from_home_km=850.0,
        special_remarks='',
        status='Allocated',
        admin_remarks='Allocated to SR University Boys Hostel BH-05 Room BH-102 Bed-1',
        applied_at=datetime.utcnow() - timedelta(days=12),
        reviewed_at=datetime.utcnow() - timedelta(days=10)
    )

    # 7.2 Applications waiting in 'Approved' status (Ready for Smart Allocation demonstration!)
    stu_vikram = students_map['vikram_singh'][0]
    app_vikram = Application(
        student_id=stu_vikram.id,
        preferred_hostel_id=hostel1.id,
        preferred_room_type='Double',
        academic_score=8.95,
        distance_from_home_km=260.0,
        special_remarks='Prefers 1st or 2nd floor.',
        status='Approved',
        admin_remarks='Approved. Waiting for smart batch allocation.',
        applied_at=datetime.utcnow() - timedelta(days=4),
        reviewed_at=datetime.utcnow() - timedelta(days=1)
    )

    stu_kavya = students_map['kavya_reddy'][0]
    app_kavya = Application(
        student_id=stu_kavya.id,
        preferred_hostel_id=hostel2.id,
        preferred_room_type='Double',
        academic_score=9.25,
        distance_from_home_km=520.0,
        special_remarks='Requires study table facing window.',
        status='Approved',
        admin_remarks='Approved. Eligible for SR University Girls Hostel GH-05.',
        applied_at=datetime.utcnow() - timedelta(days=5),
        reviewed_at=datetime.utcnow() - timedelta(days=2)
    )

    stu_aditya = students_map['aditya_joshi'][0]
    app_aditya = Application(
        student_id=stu_aditya.id,
        preferred_hostel_id=hostel4.id,
        preferred_room_type='Single',
        academic_score=9.10,
        distance_from_home_km=400.0,
        special_remarks='Prefers quiet study area for project research.',
        status='Approved',
        admin_remarks='Approved by Warden and verified.',
        applied_at=datetime.utcnow() - timedelta(days=6),
        reviewed_at=datetime.utcnow() - timedelta(days=1)
    )

    # 7.3 Applications in 'Pending' status (For Admin to Review & Approve)
    stu_divya = students_map['divya_mehta'][0]
    app_divya = Application(
        student_id=stu_divya.id,
        preferred_hostel_id=hostel3.id,
        preferred_room_type='Triple',
        academic_score=8.70,
        distance_from_home_km=310.0,
        special_remarks='First-year fresher applying for shared accommodation.',
        status='Pending',
        applied_at=datetime.utcnow() - timedelta(days=2)
    )

    stu_tanmay = students_map['tanmay_bhatia'][0]
    app_tanmay = Application(
        student_id=stu_tanmay.id,
        preferred_hostel_id=hostel1.id,
        preferred_room_type='Triple',
        academic_score=8.15,
        distance_from_home_km=180.0,
        special_remarks='First-year engineering student.',
        status='Pending',
        applied_at=datetime.utcnow() - timedelta(days=1)
    )

    stu_meera = students_map['meera_sen'][0]
    app_meera = Application(
        student_id=stu_meera.id,
        preferred_hostel_id=hostel2.id,
        preferred_room_type='Single',
        academic_score=9.30,
        distance_from_home_km=750.0,
        special_remarks='Transfer student from international exchange program.',
        status='Pending',
        applied_at=datetime.utcnow() - timedelta(hours=8)
    )

    db.session.add_all([
        app_rahul, app_priya, app_arjun, app_ananya, app_sneha, app_rohit,
        app_vikram, app_kavya, app_aditya, app_divya, app_tanmay, app_meera
    ])

    # 8. Sample Complaints
    comp1 = Complaint(
        student_id=stu_rahul.id,
        hostel_id=hostel1.id,
        room_number='BH-101',
        category='Internet',
        priority='High',
        title='Wi-Fi Access Point Frequent Disconnections',
        description='The Wi-Fi router on 1st Floor Block A disconnects every 15 minutes during late evenings. Unable to attend online lab sessions.',
        status='In Progress',
        warden_remarks='[Dr. Rajesh Sharma]: Network admin team notified. Replacement router requisition submitted.',
        created_at=datetime.utcnow() - timedelta(days=3)
    )

    comp2 = Complaint(
        student_id=stu_priya.id,
        hostel_id=hostel2.id,
        room_number='GH-101',
        category='Water supply',
        priority='Medium',
        title='Geyser Thermostat Adjustment',
        description='The solar geyser water temperature is lukewarm early morning at 7 AM. Kindly check the backup heating element.',
        status='Resolved',
        warden_remarks='[Prof. Sunita Deshmukh]: Maintenance electrician inspected heating coil and restored timer settings. Resolved.',
        created_at=datetime.utcnow() - timedelta(days=6),
        resolved_at=datetime.utcnow() - timedelta(days=4)
    )

    comp3 = Complaint(
        student_id=stu_arjun.id,
        hostel_id=hostel1.id,
        room_number='BH-101',
        category='Maintenance',
        priority='Low',
        title='Study Table Drawer Handle Loose',
        description='The left drawer handle on the study desk is loose and rattles. Please send the campus carpenter.',
        status='Pending',
        created_at=datetime.utcnow() - timedelta(days=1)
    )

    comp4 = Complaint(
        student_id=stu_sneha.id,
        hostel_id=hostel3.id,
        room_number='SRG-101',
        category='Cleaning',
        priority='Low',
        title='Balcony Floor Dusting Post Rain',
        description='Leaves and rainwater gathered in the corner of room SRG-101 balcony. Request extra housekeeping cleaning.',
        status='Resolved',
        warden_remarks='Housekeeping attendant cleared and sanitized the balcony on Friday morning.',
        created_at=datetime.utcnow() - timedelta(days=8),
        resolved_at=datetime.utcnow() - timedelta(days=7)
    )

    db.session.add_all([comp1, comp2, comp3, comp4])

    # 9. Notices
    notice1 = Notice(
        title="Hostel Night In-Time & Biometric System Guidelines",
        content="All undergraduate residents of Boys and Girls Hostels are reminded that the curfew entry time is strictly 10:00 PM on weekdays and 10:30 PM on weekends. Ensure biometric fingerprint logging at the main reception turnstiles. Disciplinary action will apply for repeated unregistered late entries.",
        target_audience="All",
        category="Urgent",
        posted_by_id=admin_user.id,
        created_at=datetime.utcnow() - timedelta(days=5)
    )

    notice2 = Notice(
        title="Inter-Hostel Cricket & Badminton Championship 2024",
        content="Registration is now open for the annual Inter-Hostel Sports Fest. Captains from SR University Boys, Girls, Sumathi Reddy, and KITS halls must register team rosters by Friday 5:00 PM at the Student Activity Center.",
        target_audience="All",
        category="General",
        posted_by_id=admin_user.id,
        created_at=datetime.utcnow() - timedelta(days=3)
    )

    notice3 = Notice(
        title="SR University Boys Hostel BH-05: Quarterly RO Water Cooler Sanitization",
        content="Please note that all water coolers across Floors 1, 2, and 3 will undergo filter replacement and sanitization on Saturday between 9:00 AM and 1:00 PM. Alternate drinking water dispensers will be placed in the main foyer.",
        target_audience="Boys Hostel",
        category="Maintenance",
        posted_by_id=warden_user1.id,
        created_at=datetime.utcnow() - timedelta(days=1)
    )

    notice4 = Notice(
        title="SR University Girls Hostel GH-05: Yoga & Fitness Workshop Kickoff",
        content="A specialized 4-week weekend wellness and yoga session begins this Saturday at 6:30 AM in the recreation lawn. All residents are invited. Yoga mats will be supplied by the hostel sports committee.",
        target_audience="Girls Hostel",
        category="Event",
        posted_by_id=warden_user2.id,
        created_at=datetime.utcnow() - timedelta(days=2)
    )

    db.session.add_all([notice1, notice2, notice3, notice4])

    # 10. Sample Student Notifications
    notif1 = Notification(
        user_id=students_map['rahul_sharma'][1].id,
        title="Room Allocated",
        message="Congratulations! You have been allocated SR University Boys Hostel BH-05, Room BH-101 (Bed-1).",
        notification_type="success",
        link="/student/room-details",
        created_at=datetime.utcnow() - timedelta(days=18)
    )

    notif2 = Notification(
        user_id=students_map['priya_patel'][1].id,
        title="Room Allocated",
        message="Congratulations! You have been allocated SR University Girls Hostel GH-05, Room GH-101 (Bed-1).",
        notification_type="success",
        link="/student/room-details",
        created_at=datetime.utcnow() - timedelta(days=19)
    )

    notif3 = Notification(
        user_id=students_map['vikram_singh'][1].id,
        title="Application Approved",
        message="Your hostel accommodation application has been approved by the admin. Room allocation will occur during the upcoming batch run.",
        notification_type="info",
        link="/student/application-status",
        created_at=datetime.utcnow() - timedelta(days=1)
    )

    db.session.add_all([notif1, notif2, notif3])

    db.session.commit()
    print("Database seeding completed successfully!")
