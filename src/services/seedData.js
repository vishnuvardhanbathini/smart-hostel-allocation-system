export const initialUsers = [
  { id: 1, username: 'admin', email: 'admin@university.edu', role: 'admin', password: 'admin123', display_name: 'System Administrator' },
  { id: 2, username: 'warden_boys', email: 'warden.boys@university.edu', role: 'warden', password: 'warden123', display_name: 'Dr. Rajesh Sharma' },
  { id: 3, username: 'warden_girls', email: 'warden.girls@university.edu', role: 'warden', password: 'warden123', display_name: 'Prof. Sunita Deshmukh' },
  { id: 4, username: 'rahul_sharma', email: 'rahul.s@university.edu', role: 'student', password: 'student123', display_name: 'Rahul Sharma' },
  { id: 5, username: 'priya_patel', email: 'priya.p@university.edu', role: 'student', password: 'student123', display_name: 'Priya Patel' },
  { id: 6, username: 'arjun_verma', email: 'arjun.v@university.edu', role: 'student', password: 'student123', display_name: 'Arjun Verma' },
  { id: 7, username: 'ananya_iyer', email: 'ananya.i@university.edu', role: 'student', password: 'student123', display_name: 'Ananya Iyer' },
  { id: 8, username: 'rohit_nair', email: 'rohit.n@university.edu', role: 'student', password: 'student123', display_name: 'Rohit Nair' },
  { id: 9, username: 'sneha_kulkarni', email: 'sneha.k@university.edu', role: 'student', password: 'student123', display_name: 'Sneha Kulkarni' },
  { id: 10, username: 'vikram_singh', email: 'vikram.s@university.edu', role: 'student', password: 'student123', display_name: 'Vikram Singh' },
  { id: 11, username: 'kavya_reddy', email: 'kavya.r@university.edu', role: 'student', password: 'student123', display_name: 'Kavya Reddy' },
  { id: 12, username: 'aditya_joshi', email: 'aditya.j@university.edu', role: 'student', password: 'student123', display_name: 'Aditya Joshi' },
  { id: 13, username: 'divya_mehta', email: 'divya.m@university.edu', role: 'student', password: 'student123', display_name: 'Divya Mehta' },
  { id: 14, username: 'tanmay_bhatia', email: 'tanmay.b@university.edu', role: 'student', password: 'student123', display_name: 'Tanmay Bhatia' },
  { id: 15, username: 'meera_sen', email: 'meera.s@university.edu', role: 'student', password: 'student123', display_name: 'Meera Sen' }
];

export const initialHostels = [
  {
    id: 1,
    name: "SR University Boys Hostel BH-05",
    code: "BH-05",
    hostel_type: "Boys",
    total_floors: 3,
    description: "Comfortable and secure hostel accommodation for male students of SR University, providing a student-friendly living environment.",
    facilities: "High-Speed Wi-Fi, Study Lounge, Gym, Laundry Room, Cafeteria",
    image_url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    warden_id: 1
  },
  {
    id: 2,
    name: "SR University Girls Hostel GH-05",
    code: "GH-05",
    hostel_type: "Girls",
    total_floors: 3,
    description: "Safe, comfortable, and well-maintained residential accommodation for female students at SR University with 24/7 security.",
    facilities: "High-Speed Wi-Fi, Biometric Access, Study Lounge, Recreation Room",
    image_url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
    warden_id: 2
  },
  {
    id: 3,
    name: "Sumathi Reddy Girls Hostel",
    code: "SRG",
    hostel_type: "Girls",
    total_floors: 2,
    description: "A comfortable and secure residential facility for female students, providing a peaceful environment for academic and personal development.",
    facilities: "Wi-Fi, Reading Room, Dining Hall, Solar Hot Water",
    image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    warden_id: null
  },
  {
    id: 4,
    name: "KITS Boys Hostel",
    code: "KBH",
    hostel_type: "Boys",
    total_floors: 2,
    description: "Student accommodation for male students of Kakatiya Institute of Technology and Science, providing essential residential facilities and study environment.",
    facilities: "Wi-Fi, Study Area, Dining Hall, Sports Court",
    image_url: "/images/kitsboyshostel.jpg",
    warden_id: null
  }
];

export const initialWardens = [
  {
    id: 1,
    user_id: 2,
    warden_id: 'WRD-B-101',
    full_name: 'Dr. Rajesh Sharma',
    email: 'warden.boys@university.edu',
    phone: '+91 98765 43210',
    hostel_id: 1,
    office_location: 'Ground Floor, Admin Wing, SR University Boys Hostel BH-05'
  },
  {
    id: 2,
    user_id: 3,
    warden_id: 'WRD-G-201',
    full_name: 'Prof. Sunita Deshmukh',
    email: 'warden.girls@university.edu',
    phone: '+91 98765 43211',
    hostel_id: 2,
    office_location: 'Block A, Ground Floor, SR University Girls Hostel GH-05'
  }
];

export const initialRooms = [
  // Hostel 1 - BH-05
  { id: 1, hostel_id: 1, room_number: 'BH-101', floor: 1, room_type: 'Double', capacity: 2, occupied_beds: 2, price_per_semester: 18000, facilities: 'Attached Bath, Balcony, Study Desk', status: 'Full' },
  { id: 2, hostel_id: 1, room_number: 'BH-102', floor: 1, room_type: 'Double', capacity: 2, occupied_beds: 1, price_per_semester: 18000, facilities: 'Attached Bath, Study Desk', status: 'Partially Occupied' },
  { id: 3, hostel_id: 1, room_number: 'BH-103', floor: 1, room_type: 'Triple', capacity: 3, occupied_beds: 0, price_per_semester: 14000, facilities: 'Spacious, Balcony, Wardrobes', status: 'Available' },
  { id: 4, hostel_id: 1, room_number: 'BH-104', floor: 1, room_type: 'Single', capacity: 1, occupied_beds: 0, price_per_semester: 24000, facilities: 'Attached Bath, AC, Balcony', status: 'Available' },
  { id: 5, hostel_id: 1, room_number: 'BH-201', floor: 2, room_type: 'Double', capacity: 2, occupied_beds: 0, price_per_semester: 18000, facilities: 'Attached Bath, High Floor View', status: 'Available' },
  { id: 6, hostel_id: 1, room_number: 'BH-202', floor: 2, room_type: 'Double', capacity: 2, occupied_beds: 0, price_per_semester: 18000, facilities: 'Study Desks, Wardrobes', status: 'Available' },
  { id: 7, hostel_id: 1, room_number: 'BH-203', floor: 2, room_type: 'Triple', capacity: 3, occupied_beds: 0, price_per_semester: 14000, facilities: 'Balcony, Attached Washroom', status: 'Available' },
  { id: 8, hostel_id: 1, room_number: 'BH-204', floor: 2, room_type: 'Single', capacity: 1, occupied_beds: 0, price_per_semester: 24000, facilities: 'Single Occupancy, Study Area', status: 'Available' },
  { id: 9, hostel_id: 1, room_number: 'BH-301', floor: 3, room_type: 'Double', capacity: 2, occupied_beds: 0, price_per_semester: 18000, facilities: 'Top Floor, Quiet Wing', status: 'Available' },
  { id: 10, hostel_id: 1, room_number: 'BH-302', floor: 3, room_type: 'Triple', capacity: 3, occupied_beds: 0, price_per_semester: 14000, facilities: 'Spacious Triple, Balcony', status: 'Available' },

  // Hostel 2 - GH-05
  { id: 11, hostel_id: 2, room_number: 'GH-101', floor: 1, room_type: 'Double', capacity: 2, occupied_beds: 2, price_per_semester: 18000, facilities: 'Garden View, Attached Bath', status: 'Full' },
  { id: 12, hostel_id: 2, room_number: 'GH-102', floor: 1, room_type: 'Double', capacity: 2, occupied_beds: 0, price_per_semester: 18000, facilities: 'Attached Bath, Balcony', status: 'Available' },
  { id: 13, hostel_id: 2, room_number: 'GH-103', floor: 1, room_type: 'Triple', capacity: 3, occupied_beds: 0, price_per_semester: 14000, facilities: 'Spacious, Built-in Wardrobes', status: 'Available' },
  { id: 14, hostel_id: 2, room_number: 'GH-104', floor: 1, room_type: 'Single', capacity: 1, occupied_beds: 0, price_per_semester: 24000, facilities: 'Quiet Single, Garden Facing', status: 'Available' },
  { id: 15, hostel_id: 2, room_number: 'GH-201', floor: 2, room_type: 'Double', capacity: 2, occupied_beds: 0, price_per_semester: 18000, facilities: 'Attached Bath, Balcony', status: 'Available' },
  { id: 16, hostel_id: 2, room_number: 'GH-202', floor: 2, room_type: 'Double', capacity: 2, occupied_beds: 0, price_per_semester: 18000, facilities: 'Dual Study Stations', status: 'Available' },
  { id: 17, hostel_id: 2, room_number: 'GH-203', floor: 2, room_type: 'Triple', capacity: 3, occupied_beds: 0, price_per_semester: 14000, facilities: 'Spacious Triple, Large Balcony', status: 'Available' },
  { id: 18, hostel_id: 2, room_number: 'GH-301', floor: 3, room_type: 'Double', capacity: 2, occupied_beds: 0, price_per_semester: 18000, facilities: 'Terrace Access, Quiet', status: 'Available' },
  { id: 19, hostel_id: 2, room_number: 'GH-302', floor: 3, room_type: 'Single', capacity: 1, occupied_beds: 0, price_per_semester: 24000, facilities: 'Attached Bath, Private Balcony', status: 'Available' },

  // Hostel 3 - SRG
  { id: 20, hostel_id: 3, room_number: 'SRG-101', floor: 1, room_type: 'Single', capacity: 1, occupied_beds: 1, price_per_semester: 26000, facilities: 'Reading Desk, High Speed Wi-Fi, Garden Facing', status: 'Full' },
  { id: 21, hostel_id: 3, room_number: 'SRG-102', floor: 1, room_type: 'Double', capacity: 2, occupied_beds: 0, price_per_semester: 20000, facilities: 'Attached Bath, Dual Wardrobes', status: 'Available' },
  { id: 22, hostel_id: 3, room_number: 'SRG-103', floor: 1, room_type: 'Triple', capacity: 3, occupied_beds: 0, price_per_semester: 15000, facilities: 'Spacious Triple, Quiet Floor', status: 'Available' },
  { id: 23, hostel_id: 3, room_number: 'SRG-201', floor: 2, room_type: 'Single', capacity: 1, occupied_beds: 0, price_per_semester: 26000, facilities: 'Private Balcony, Attached Washroom', status: 'Available' },
  { id: 24, hostel_id: 3, room_number: 'SRG-202', floor: 2, room_type: 'Double', capacity: 2, occupied_beds: 0, price_per_semester: 20000, facilities: 'Dual Study Desks, Balcony', status: 'Available' },

  // Hostel 4 - KBH
  { id: 25, hostel_id: 4, room_number: 'KB-101', floor: 1, room_type: 'Single', capacity: 1, occupied_beds: 0, price_per_semester: 24000, facilities: 'Attached Bath, Wi-Fi, Ergonomic Desk', status: 'Available' },
  { id: 26, hostel_id: 4, room_number: 'KB-102', floor: 1, room_type: 'Double', capacity: 2, occupied_beds: 0, price_per_semester: 18000, facilities: 'Balcony, Dual Desks, Study Area', status: 'Available' },
  { id: 27, hostel_id: 4, room_number: 'KB-103', floor: 1, room_type: 'Triple', capacity: 3, occupied_beds: 0, price_per_semester: 14000, facilities: 'Spacious Room, Attached Bath', status: 'Available' },
  { id: 28, hostel_id: 4, room_number: 'KB-201', floor: 2, room_type: 'Single', capacity: 1, occupied_beds: 0, price_per_semester: 24000, facilities: 'Top Floor View, High-Speed Wi-Fi', status: 'Available' },
  { id: 29, hostel_id: 4, room_number: 'KB-202', floor: 2, room_type: 'Double', capacity: 2, occupied_beds: 0, price_per_semester: 18000, facilities: 'Spacious Wardrobes, Balcony', status: 'Available' }
];

export const initialStudents = [
  { id: 1, user_id: 4, student_id: 'STU2024001', full_name: 'Rahul Sharma', email: 'rahul.s@university.edu', phone: '+91 98111 22334', gender: 'Male', department: 'Computer Science and Engineering', year_of_study: 3, address: 'B-42 Civil Lines, Jaipur, Rajasthan', parent_name: 'Virendra Sharma', parent_phone: '+91 98111 99887' },
  { id: 2, user_id: 5, student_id: 'STU2024002', full_name: 'Priya Patel', email: 'priya.p@university.edu', phone: '+91 98222 33445', gender: 'Female', department: 'Information Technology', year_of_study: 2, address: '12 Navrangpura, Ahmedabad, Gujarat', parent_name: 'Kirit Patel', parent_phone: '+91 98222 88776' },
  { id: 3, user_id: 6, student_id: 'STU2024003', full_name: 'Arjun Verma', email: 'arjun.v@university.edu', phone: '+91 98333 44556', gender: 'Male', department: 'Mechanical Engineering', year_of_study: 3, address: '78 Gomti Nagar, Lucknow, UP', parent_name: 'Sanjay Verma', parent_phone: '+91 98333 77665' },
  { id: 4, user_id: 7, student_id: 'STU2024004', full_name: 'Ananya Iyer', email: 'ananya.i@university.edu', phone: '+91 98444 55667', gender: 'Female', department: 'Electronics and Communication', year_of_study: 1, address: '23 Indiranagar, Bengaluru, Karnataka', parent_name: 'R. Subramaniam Iyer', parent_phone: '+91 98444 66554' },
  { id: 5, user_id: 8, student_id: 'STU2024005', full_name: 'Rohit Nair', email: 'rohit.n@university.edu', phone: '+91 98555 66778', gender: 'Male', department: 'Civil Engineering', year_of_study: 2, address: '45 Marine Drive, Kochi, Kerala', parent_name: 'Mohan Nair', parent_phone: '+91 98555 55443' },
  { id: 6, user_id: 9, student_id: 'STU2024006', full_name: 'Sneha Kulkarni', email: 'sneha.k@university.edu', phone: '+91 98666 77889', gender: 'Female', department: 'Computer Science and Engineering', year_of_study: 4, address: '88 Kothrud, Pune, Maharashtra', parent_name: 'Anand Kulkarni', parent_phone: '+91 98666 44332' },
  { id: 7, user_id: 10, student_id: 'STU2024007', full_name: 'Vikram Singh', email: 'vikram.s@university.edu', phone: '+91 98777 88990', gender: 'Male', department: 'Electrical Engineering', year_of_study: 1, address: '10 Raja Park, Jaipur, Rajasthan', parent_name: 'Col. R. S. Singh', parent_phone: '+91 98777 33221' },
  { id: 8, user_id: 11, student_id: 'STU2024008', full_name: 'Kavya Reddy', email: 'kavya.r@university.edu', phone: '+91 98888 99001', gender: 'Female', department: 'Biotechnology', year_of_study: 2, address: '67 Jubilee Hills, Hyderabad, Telangana', parent_name: 'Suresh Reddy', parent_phone: '+91 98888 22110' },
  { id: 9, user_id: 12, student_id: 'STU2024009', full_name: 'Aditya Joshi', email: 'aditya.j@university.edu', phone: '+91 98999 11223', gender: 'Male', department: 'Computer Science and Engineering', year_of_study: 4, address: '90 Shivaji Park, Mumbai, Maharashtra', parent_name: 'Prakash Joshi', parent_phone: '+91 98999 11009' },
  { id: 10, user_id: 13, student_id: 'STU2024010', full_name: 'Divya Mehta', email: 'divya.m@university.edu', phone: '+91 98123 45678', gender: 'Female', department: 'Artificial Intelligence & Data Science', year_of_study: 1, address: '5 Sector 14, Chandigarh', parent_name: 'Dinesh Mehta', parent_phone: '+91 98123 98765' },
  { id: 11, user_id: 14, student_id: 'STU2024011', full_name: 'Tanmay Bhatia', email: 'tanmay.b@university.edu', phone: '+91 98234 56789', gender: 'Male', department: 'Information Technology', year_of_study: 1, address: '14 Model Town, Delhi', parent_name: 'Harish Bhatia', parent_phone: '+91 98234 87654' },
  { id: 12, user_id: 15, student_id: 'STU2024012', full_name: 'Meera Sen', email: 'meera.s@university.edu', phone: '+91 98345 67890', gender: 'Female', department: 'Computer Science and Engineering', year_of_study: 3, address: '3 Salt Lake City, Kolkata, West Bengal', parent_name: 'Subhash Sen', parent_phone: '+91 98345 76543' }
];

export const initialAllocations = [
  { id: 1, student_id: 1, room_id: 1, hostel_id: 1, bed_number: 'Bed-1', academic_year: '2024-2025', status: 'Active', allocated_date: '2024-07-15T09:00:00Z' },
  { id: 2, student_id: 3, room_id: 1, hostel_id: 1, bed_number: 'Bed-2', academic_year: '2024-2025', status: 'Active', allocated_date: '2024-07-15T09:30:00Z' },
  { id: 3, student_id: 2, room_id: 11, hostel_id: 2, bed_number: 'Bed-1', academic_year: '2024-2025', status: 'Active', allocated_date: '2024-07-16T10:00:00Z' },
  { id: 4, student_id: 4, room_id: 11, hostel_id: 2, bed_number: 'Bed-2', academic_year: '2024-2025', status: 'Active', allocated_date: '2024-07-16T10:15:00Z' },
  { id: 5, student_id: 6, room_id: 20, hostel_id: 3, bed_number: 'Bed-1', academic_year: '2024-2025', status: 'Active', allocated_date: '2024-07-18T11:00:00Z' },
  { id: 6, student_id: 5, room_id: 2, hostel_id: 1, bed_number: 'Bed-1', academic_year: '2024-2025', status: 'Active', allocated_date: '2024-07-20T14:00:00Z' }
];

export const initialApplications = [
  { id: 1, student_id: 1, preferred_hostel_id: 1, preferred_room_type: 'Double', academic_score: 8.85, distance_from_home_km: 280.0, special_remarks: 'Request room near library wing.', status: 'Allocated', admin_remarks: 'Allocated to SR University Boys Hostel BH-05 Room BH-101 Bed-1', applied_at: '2024-07-01T10:00:00Z' },
  { id: 2, student_id: 2, preferred_hostel_id: 2, preferred_room_type: 'Double', academic_score: 9.12, distance_from_home_km: 450.0, special_remarks: 'Prefers quiet wing for research.', status: 'Allocated', admin_remarks: 'Allocated to SR University Girls Hostel GH-05 Room GH-101 Bed-1', applied_at: '2024-07-02T11:00:00Z' },
  { id: 3, student_id: 3, preferred_hostel_id: 1, preferred_room_type: 'Double', academic_score: 8.40, distance_from_home_km: 320.0, special_remarks: '', status: 'Allocated', admin_remarks: 'Allocated to SR University Boys Hostel BH-05 Room BH-101 Bed-2', applied_at: '2024-07-03T12:00:00Z' },
  { id: 4, student_id: 4, preferred_hostel_id: 2, preferred_room_type: 'Double', academic_score: 9.45, distance_from_home_km: 600.0, special_remarks: 'First-year student scholarship recipient', status: 'Allocated', admin_remarks: 'Allocated to SR University Girls Hostel GH-05 Room GH-101 Bed-2', applied_at: '2024-07-04T09:00:00Z' },
  { id: 5, student_id: 6, preferred_hostel_id: 3, preferred_room_type: 'Single', academic_score: 9.60, distance_from_home_km: 310.0, special_remarks: 'Final-year thesis work requires quiet single room.', status: 'Allocated', admin_remarks: 'Allocated to Sumathi Reddy Girls Hostel Room SRG-101', applied_at: '2024-07-05T14:00:00Z' },
  { id: 6, student_id: 5, preferred_hostel_id: 1, preferred_room_type: 'Double', academic_score: 8.10, distance_from_home_km: 850.0, special_remarks: '', status: 'Allocated', admin_remarks: 'Allocated to SR University Boys Hostel BH-05 Room BH-102 Bed-1', applied_at: '2024-07-06T15:00:00Z' },
  { id: 7, student_id: 7, preferred_hostel_id: 1, preferred_room_type: 'Double', academic_score: 8.95, distance_from_home_km: 260.0, special_remarks: 'Prefers 1st or 2nd floor.', status: 'Approved', admin_remarks: 'Approved. Waiting for smart batch allocation.', applied_at: '2024-07-10T11:00:00Z' },
  { id: 8, student_id: 8, preferred_hostel_id: 2, preferred_room_type: 'Double', academic_score: 9.25, distance_from_home_km: 520.0, special_remarks: 'Requires study table facing window.', status: 'Approved', admin_remarks: 'Approved. Eligible for SR University Girls Hostel GH-05.', applied_at: '2024-07-11T12:00:00Z' },
  { id: 9, student_id: 9, preferred_hostel_id: 4, preferred_room_type: 'Single', academic_score: 9.10, distance_from_home_km: 400.0, special_remarks: 'Prefers quiet study area for project research.', status: 'Approved', admin_remarks: 'Approved by Warden and verified.', applied_at: '2024-07-12T13:00:00Z' },
  { id: 10, student_id: 10, preferred_hostel_id: 3, preferred_room_type: 'Triple', academic_score: 8.70, distance_from_home_km: 310.0, special_remarks: 'First-year fresher applying for shared accommodation.', status: 'Pending', applied_at: '2024-07-14T10:00:00Z' },
  { id: 11, student_id: 11, preferred_hostel_id: 1, preferred_room_type: 'Triple', academic_score: 8.15, distance_from_home_km: 180.0, special_remarks: 'First-year engineering student.', status: 'Pending', applied_at: '2024-07-15T09:30:00Z' },
  { id: 12, student_id: 12, preferred_hostel_id: 2, preferred_room_type: 'Single', academic_score: 9.30, distance_from_home_km: 750.0, special_remarks: 'Transfer student from international exchange program.', status: 'Pending', applied_at: '2024-07-16T14:45:00Z' }
];

export const initialComplaints = [
  {
    id: 1,
    student_id: 1,
    hostel_id: 1,
    room_number: 'BH-101',
    category: 'Internet',
    priority: 'High',
    title: 'Wi-Fi Access Point Frequent Disconnections',
    description: 'The Wi-Fi router on 1st Floor Block A disconnects every 15 minutes during late evenings. Unable to attend online lab sessions.',
    status: 'In Progress',
    warden_remarks: '[Dr. Rajesh Sharma]: Network admin team notified. Replacement router requisition submitted.',
    created_at: '2024-07-20T10:00:00Z',
    resolved_at: null
  },
  {
    id: 2,
    student_id: 2,
    hostel_id: 2,
    room_number: 'GH-101',
    category: 'Water supply',
    priority: 'Medium',
    title: 'Geyser Thermostat Adjustment',
    description: 'The solar geyser water temperature is lukewarm early morning at 7 AM. Kindly check the backup heating element.',
    status: 'Resolved',
    warden_remarks: '[Prof. Sunita Deshmukh]: Maintenance electrician inspected heating coil and restored timer settings. Resolved.',
    created_at: '2024-07-18T08:00:00Z',
    resolved_at: '2024-07-19T14:00:00Z'
  },
  {
    id: 3,
    student_id: 3,
    hostel_id: 1,
    room_number: 'BH-101',
    category: 'Maintenance',
    priority: 'Low',
    title: 'Study Table Drawer Handle Loose',
    description: 'The left drawer handle on the study desk is loose and rattles. Please send the campus carpenter.',
    status: 'Pending',
    warden_remarks: null,
    created_at: '2024-07-21T11:00:00Z',
    resolved_at: null
  },
  {
    id: 4,
    student_id: 6,
    hostel_id: 3,
    room_number: 'SRG-101',
    category: 'Cleaning',
    priority: 'Low',
    title: 'Balcony Floor Dusting Post Rain',
    description: 'Leaves and rainwater gathered in the corner of room SRG-101 balcony. Request extra housekeeping cleaning.',
    status: 'Resolved',
    warden_remarks: 'Housekeeping attendant cleared and sanitized the balcony on Friday morning.',
    created_at: '2024-07-15T09:00:00Z',
    resolved_at: '2024-07-16T12:00:00Z'
  }
];

export const initialNotices = [
  {
    id: 1,
    title: "Hostel Night In-Time & Biometric System Guidelines",
    content: "All undergraduate residents of Boys and Girls Hostels are reminded that the curfew entry time is strictly 10:00 PM on weekdays and 10:30 PM on weekends. Ensure biometric fingerprint logging at the main reception turnstiles. Disciplinary action will apply for repeated unregistered late entries.",
    target_audience: "All",
    category: "Urgent",
    author: "System Administrator",
    created_at: "2024-07-15T18:00:00Z"
  },
  {
    id: 2,
    title: "Inter-Hostel Cricket & Badminton Championship 2024",
    content: "Registration is now open for the annual Inter-Hostel Sports Fest. Captains from SR University Boys, Girls, Sumathi Reddy, and KITS halls must register team rosters by Friday 5:00 PM at the Student Activity Center.",
    target_audience: "All",
    category: "General",
    author: "System Administrator",
    created_at: "2024-07-17T12:00:00Z"
  },
  {
    id: 3,
    title: "SR University Boys Hostel BH-05: Quarterly RO Water Cooler Sanitization",
    content: "Please note that all water coolers across Floors 1, 2, and 3 will undergo filter replacement and sanitization on Saturday between 9:00 AM and 1:00 PM. Alternate drinking water dispensers will be placed in the main foyer.",
    target_audience: "Boys Hostel",
    category: "Maintenance",
    author: "Dr. Rajesh Sharma",
    created_at: "2024-07-19T09:30:00Z"
  },
  {
    id: 4,
    title: "SR University Girls Hostel GH-05: Yoga & Fitness Workshop Kickoff",
    content: "A specialized 4-week weekend wellness and yoga session begins this Saturday at 6:30 AM in the recreation lawn. All residents are invited. Yoga mats will be supplied by the hostel sports committee.",
    target_audience: "Girls Hostel",
    category: "Event",
    author: "Prof. Sunita Deshmukh",
    created_at: "2024-07-18T16:00:00Z"
  }
];

export const initialNotifications = [
  {
    id: 1,
    user_id: 4,
    title: "Room Allocated",
    message: "Congratulations! You have been allocated SR University Boys Hostel BH-05, Room BH-101 (Bed-1).",
    type: "success",
    link: "/student/room-details",
    is_read: false,
    created_at: "2024-07-15T09:00:00Z"
  },
  {
    id: 2,
    user_id: 5,
    title: "Room Allocated",
    message: "Congratulations! You have been allocated SR University Girls Hostel GH-05, Room GH-101 (Bed-1).",
    type: "success",
    link: "/student/room-details",
    is_read: false,
    created_at: "2024-07-16T10:00:00Z"
  },
  {
    id: 3,
    user_id: 10,
    title: "Application Approved",
    message: "Your hostel accommodation application has been approved by the admin. Room allocation will occur during the upcoming batch run.",
    type: "info",
    link: "/student/application-status",
    is_read: false,
    created_at: "2024-07-19T11:00:00Z"
  }
];
