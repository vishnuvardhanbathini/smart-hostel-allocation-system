import csv
import io
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, make_response, jsonify
from models import db, User, Student, Warden, Hostel, Room, Application, Allocation, Complaint, Notice, Notification
from routes.auth import admin_required, notify_user

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/dashboard')
@admin_required
def dashboard():
    total_students = Student.query.count()
    total_hostels = Hostel.query.count()
    total_rooms = Room.query.count()
    
    rooms = Room.query.all()
    total_beds = sum(r.capacity for r in rooms)
    occupied_beds = sum(r.occupied_beds for r in rooms)
    available_beds = max(0, total_beds - occupied_beds)
    
    available_rooms_count = sum(1 for r in rooms if r.is_available)
    occupied_rooms_count = sum(1 for r in rooms if r.occupied_beds >= r.capacity)
    
    pending_applications = Application.query.filter_by(status='Pending').count()
    approved_applications = Application.query.filter_by(status='Approved').count()
    allocated_count = Allocation.query.filter_by(status='Active').count()
    pending_complaints = Complaint.query.filter(Complaint.status != 'Resolved').count()

    recent_students = Student.query.order_by(Student.created_at.desc()).limit(5).all()
    recent_applications = Application.query.order_by(Application.applied_at.desc()).limit(5).all()
    recent_complaints = Complaint.query.order_by(Complaint.created_at.desc()).limit(5).all()

    # Chart 1: Hostel Occupancy
    hostels = Hostel.query.all()
    hostel_labels = [h.name for h in hostels]
    hostel_occupied = [h.total_occupied_beds for h in hostels]
    hostel_available = [h.available_beds_count for h in hostels]

    # Chart 2: Room types
    room_types = ['Single', 'Double', 'Triple', 'Four-Bed']
    room_type_counts = [Room.query.filter_by(room_type=rt).count() for rt in room_types]

    return render_template('admin/dashboard.html',
        total_students=total_students,
        total_hostels=total_hostels,
        total_rooms=total_rooms,
        total_beds=total_beds,
        occupied_beds=occupied_beds,
        available_beds=available_beds,
        available_rooms_count=available_rooms_count,
        occupied_rooms_count=occupied_rooms_count,
        pending_applications=pending_applications,
        approved_applications=approved_applications,
        allocated_count=allocated_count,
        pending_complaints=pending_complaints,
        recent_students=recent_students,
        recent_applications=recent_applications,
        recent_complaints=recent_complaints,
        hostel_labels=hostel_labels,
        hostel_occupied=hostel_occupied,
        hostel_available=hostel_available,
        room_types=room_types,
        room_type_counts=room_type_counts
    )

# ==================== STUDENT MANAGEMENT ====================
@admin_bp.route('/students')
@admin_required
def students():
    search = request.args.get('search', '').strip()
    department = request.args.get('department', '').strip()
    year = request.args.get('year', '', type=str)
    gender = request.args.get('gender', '').strip()

    query = Student.query
    if search:
        query = query.filter(
            (Student.full_name.ilike(f'%{search}%')) |
            (Student.student_id.ilike(f'%{search}%')) |
            (Student.email.ilike(f'%{search}%')) |
            (Student.phone.ilike(f'%{search}%'))
        )
    if department:
        query = query.filter(Student.department == department)
    if year:
        query = query.filter(Student.year_of_study == int(year))
    if gender:
        query = query.filter(Student.gender == gender)

    students_list = query.order_by(Student.created_at.desc()).all()
    departments = [d[0] for d in db.session.query(Student.department).distinct().all() if d[0]]

    return render_template('admin/students.html',
        students=students_list,
        departments=departments,
        search=search,
        selected_dept=department,
        selected_year=year,
        selected_gender=gender
    )

@admin_bp.route('/students/add', methods=['GET', 'POST'])
@admin_required
def add_student():
    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        student_id = request.form.get('student_id', '').strip().upper()
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', 'student123')
        phone = request.form.get('phone', '').strip()
        gender = request.form.get('gender', 'Male')
        department = request.form.get('department', '').strip()
        year_of_study = request.form.get('year_of_study', 1, type=int)
        address = request.form.get('address', '').strip()
        parent_name = request.form.get('parent_name', '').strip()
        parent_phone = request.form.get('parent_phone', '').strip()
        emergency_contact = request.form.get('emergency_contact', '').strip()

        if not full_name or not student_id or not username or not email or not phone:
            flash('Please fill in all required fields.', 'warning')
            return render_template('admin/student_form.html', student=None)

        if User.query.filter_by(username=username).first():
            flash('Username is already taken.', 'danger')
            return render_template('admin/student_form.html', student=None)

        if User.query.filter_by(email=email).first():
            flash('Email is already registered.', 'danger')
            return render_template('admin/student_form.html', student=None)

        if Student.query.filter_by(student_id=student_id).first():
            flash(f'Student ID "{student_id}" is already registered.', 'danger')
            return render_template('admin/student_form.html', student=None)

        try:
            user = User(username=username, email=email, role='student')
            user.set_password(password)
            db.session.add(user)
            db.session.flush()

            student = Student(
                user_id=user.id,
                student_id=student_id,
                full_name=full_name,
                email=email,
                phone=phone,
                gender=gender,
                department=department,
                year_of_study=year_of_study,
                address=address,
                parent_name=parent_name,
                parent_phone=parent_phone,
                emergency_contact=emergency_contact
            )
            db.session.add(student)
            db.session.commit()
            flash(f'Student "{full_name}" registered successfully.', 'success')
            return redirect(url_for('admin.students'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error adding student: {str(e)}', 'danger')

    return render_template('admin/student_form.html', student=None)

@admin_bp.route('/students/edit/<int:student_id>', methods=['GET', 'POST'])
@admin_required
def edit_student(student_id):
    student = db.session.get(Student, student_id)
    if not student:
        flash('Student not found.', 'danger')
        return redirect(url_for('admin.students'))

    if request.method == 'POST':
        student.full_name = request.form.get('full_name', '').strip()
        student.phone = request.form.get('phone', '').strip()
        student.gender = request.form.get('gender', student.gender)
        student.department = request.form.get('department', '').strip()
        student.year_of_study = request.form.get('year_of_study', student.year_of_study, type=int)
        student.address = request.form.get('address', '').strip()
        student.parent_name = request.form.get('parent_name', '').strip()
        student.parent_phone = request.form.get('parent_phone', '').strip()
        student.emergency_contact = request.form.get('emergency_contact', '').strip()

        # Update user email
        new_email = request.form.get('email', '').strip().lower()
        if new_email and new_email != student.email:
            existing = User.query.filter(User.email == new_email, User.id != student.user_id).first()
            if existing:
                flash('Email already used by another account.', 'danger')
                return render_template('admin/student_form.html', student=student)
            student.email = new_email
            student.user.email = new_email

        # Optional password update
        new_password = request.form.get('password', '').strip()
        if new_password:
            student.user.set_password(new_password)

        try:
            db.session.commit()
            flash('Student updated successfully.', 'success')
            return redirect(url_for('admin.students'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error updating student: {str(e)}', 'danger')

    return render_template('admin/student_form.html', student=student)

@admin_bp.route('/students/view/<int:student_id>')
@admin_required
def view_student(student_id):
    student = db.session.get(Student, student_id)
    if not student:
        flash('Student not found.', 'danger')
        return redirect(url_for('admin.students'))
    return render_template('admin/student_view.html', student=student)

@admin_bp.route('/students/delete/<int:student_id>', methods=['POST'])
@admin_required
def delete_student(student_id):
    student = db.session.get(Student, student_id)
    if not student:
        flash('Student not found.', 'danger')
        return redirect(url_for('admin.students'))

    try:
        # Check if active allocation exists, decrement bed count
        active_alloc = student.active_allocation
        if active_alloc:
            room = active_alloc.room
            if room and room.occupied_beds > 0:
                room.occupied_beds -= 1
                room.update_status()

        user = student.user
        db.session.delete(student)
        if user:
            db.session.delete(user)
        db.session.commit()
        flash('Student record deleted successfully.', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Error deleting student: {str(e)}', 'danger')

    return redirect(url_for('admin.students'))

# ==================== HOSTEL MANAGEMENT ====================
@admin_bp.route('/hostels')
@admin_required
def hostels():
    hostels_list = Hostel.query.order_by(Hostel.name.asc()).all()
    return render_template('admin/hostels.html', hostels=hostels_list)

@admin_bp.route('/hostels/add', methods=['GET', 'POST'])
@admin_required
def add_hostel():
    wardens = Warden.query.all()
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        hostel_type = request.form.get('hostel_type', 'Boys')
        total_floors = request.form.get('total_floors', 3, type=int)
        description = request.form.get('description', '').strip()
        facilities = request.form.get('facilities', '').strip()
        image_url = request.form.get('image_url', '').strip()
        warden_id = request.form.get('warden_id', type=int)

        if not name:
            flash('Hostel name is required.', 'warning')
            return render_template('admin/hostel_form.html', hostel=None, wardens=wardens)

        if Hostel.query.filter_by(name=name).first():
            flash('A hostel with this name already exists.', 'danger')
            return render_template('admin/hostel_form.html', hostel=None, wardens=wardens)

        try:
            hostel = Hostel(
                name=name,
                hostel_type=hostel_type,
                total_floors=total_floors,
                description=description,
                facilities=facilities,
                image_url=image_url
            )
            db.session.add(hostel)
            db.session.flush()

            if warden_id:
                warden = db.session.get(Warden, warden_id)
                if warden:
                    warden.hostel_id = hostel.id

            db.session.commit()
            flash(f'Hostel "{name}" created successfully.', 'success')
            return redirect(url_for('admin.hostels'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error adding hostel: {str(e)}', 'danger')

    return render_template('admin/hostel_form.html', hostel=None, wardens=wardens)

@admin_bp.route('/hostels/edit/<int:hostel_id>', methods=['GET', 'POST'])
@admin_required
def edit_hostel(hostel_id):
    hostel = db.session.get(Hostel, hostel_id)
    if not hostel:
        flash('Hostel not found.', 'danger')
        return redirect(url_for('admin.hostels'))

    wardens = Warden.query.all()
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        hostel_type = request.form.get('hostel_type', hostel.hostel_type)
        total_floors = request.form.get('total_floors', hostel.total_floors, type=int)
        description = request.form.get('description', '').strip()
        facilities = request.form.get('facilities', '').strip()
        image_url = request.form.get('image_url', '').strip()
        warden_id = request.form.get('warden_id', type=int)

        if not name:
            flash('Hostel name is required.', 'warning')
            return render_template('admin/hostel_form.html', hostel=hostel, wardens=wardens)

        existing = Hostel.query.filter(Hostel.name == name, Hostel.id != hostel_id).first()
        if existing:
            flash('Another hostel with this name already exists.', 'danger')
            return render_template('admin/hostel_form.html', hostel=hostel, wardens=wardens)

        try:
            hostel.name = name
            hostel.hostel_type = hostel_type
            hostel.total_floors = total_floors
            hostel.description = description
            hostel.facilities = facilities
            hostel.image_url = image_url

            # Clear current wardens
            for w in hostel.wardens:
                w.hostel_id = None

            if warden_id:
                warden = db.session.get(Warden, warden_id)
                if warden:
                    warden.hostel_id = hostel.id

            db.session.commit()
            flash('Hostel updated successfully.', 'success')
            return redirect(url_for('admin.hostels'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error updating hostel: {str(e)}', 'danger')

    return render_template('admin/hostel_form.html', hostel=hostel, wardens=wardens)

@admin_bp.route('/hostels/delete/<int:hostel_id>', methods=['POST'])
@admin_required
def delete_hostel(hostel_id):
    hostel = db.session.get(Hostel, hostel_id)
    if not hostel:
        flash('Hostel not found.', 'danger')
        return redirect(url_for('admin.hostels'))

    if hostel.total_occupied_beds > 0:
        flash('Cannot delete a hostel that has active student allocations. Please vacate students first.', 'danger')
        return redirect(url_for('admin.hostels'))

    try:
        # Reset warden assignments
        for w in hostel.wardens:
            w.hostel_id = None
        db.session.delete(hostel)
        db.session.commit()
        flash('Hostel deleted successfully.', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Error deleting hostel: {str(e)}', 'danger')

    return redirect(url_for('admin.hostels'))

# ==================== ROOM MANAGEMENT ====================
@admin_bp.route('/rooms')
@admin_required
def rooms():
    hostel_id = request.args.get('hostel_id', type=int)
    room_type = request.args.get('room_type', '').strip()
    status = request.args.get('status', '').strip()
    floor = request.args.get('floor', type=int)

    query = Room.query
    if hostel_id:
        query = query.filter(Room.hostel_id == hostel_id)
    if room_type:
        query = query.filter(Room.room_type == room_type)
    if status:
        query = query.filter(Room.status == status)
    if floor:
        query = query.filter(Room.floor == floor)

    rooms_list = query.order_by(Room.hostel_id.asc(), Room.floor.asc(), Room.room_number.asc()).all()
    hostels_list = Hostel.query.order_by(Hostel.name.asc()).all()

    return render_template('admin/rooms.html',
        rooms=rooms_list,
        hostels=hostels_list,
        selected_hostel=hostel_id,
        selected_type=room_type,
        selected_status=status,
        selected_floor=floor
    )

@admin_bp.route('/rooms/add', methods=['GET', 'POST'])
@admin_required
def add_room():
    hostels_list = Hostel.query.all()
    if request.method == 'POST':
        hostel_id = request.form.get('hostel_id', type=int)
        room_number = request.form.get('room_number', '').strip().upper()
        floor = request.form.get('floor', 1, type=int)
        room_type = request.form.get('room_type', 'Double')
        capacity = request.form.get('capacity', 2, type=int)
        price_per_semester = request.form.get('price_per_semester', 15000.0, type=float)
        facilities = request.form.get('facilities', '').strip()
        status = request.form.get('status', 'Available')

        if not hostel_id or not room_number:
            flash('Hostel and Room Number are required.', 'warning')
            return render_template('admin/room_form.html', room=None, hostels=hostels_list)

        existing = Room.query.filter_by(hostel_id=hostel_id, room_number=room_number).first()
        if existing:
            flash(f'Room {room_number} already exists in this hostel.', 'danger')
            return render_template('admin/room_form.html', room=None, hostels=hostels_list)

        try:
            room = Room(
                hostel_id=hostel_id,
                room_number=room_number,
                floor=floor,
                room_type=room_type,
                capacity=capacity,
                occupied_beds=0,
                price_per_semester=price_per_semester,
                facilities=facilities,
                status=status
            )
            db.session.add(room)
            db.session.commit()
            flash(f'Room {room_number} added successfully.', 'success')
            return redirect(url_for('admin.rooms', hostel_id=hostel_id))
        except Exception as e:
            db.session.rollback()
            flash(f'Error adding room: {str(e)}', 'danger')

    return render_template('admin/room_form.html', room=None, hostels=hostels_list)

@admin_bp.route('/rooms/edit/<int:room_id>', methods=['GET', 'POST'])
@admin_required
def edit_room(room_id):
    room = db.session.get(Room, room_id)
    if not room:
        flash('Room not found.', 'danger')
        return redirect(url_for('admin.rooms'))

    hostels_list = Hostel.query.all()
    if request.method == 'POST':
        hostel_id = request.form.get('hostel_id', type=int)
        room_number = request.form.get('room_number', '').strip().upper()
        floor = request.form.get('floor', room.floor, type=int)
        room_type = request.form.get('room_type', room.room_type)
        capacity = request.form.get('capacity', room.capacity, type=int)
        price_per_semester = request.form.get('price_per_semester', room.price_per_semester, type=float)
        facilities = request.form.get('facilities', '').strip()
        status = request.form.get('status', room.status)

        if capacity < room.occupied_beds:
            flash(f'Capacity cannot be less than currently occupied beds ({room.occupied_beds}).', 'danger')
            return render_template('admin/room_form.html', room=room, hostels=hostels_list)

        existing = Room.query.filter(Room.hostel_id == hostel_id, Room.room_number == room_number, Room.id != room_id).first()
        if existing:
            flash('Another room in this hostel already has this room number.', 'danger')
            return render_template('admin/room_form.html', room=room, hostels=hostels_list)

        try:
            room.hostel_id = hostel_id
            room.room_number = room_number
            room.floor = floor
            room.room_type = room_type
            room.capacity = capacity
            room.price_per_semester = price_per_semester
            room.facilities = facilities
            room.status = status
            room.update_status()

            db.session.commit()
            flash(f'Room {room_number} updated successfully.', 'success')
            return redirect(url_for('admin.rooms', hostel_id=hostel_id))
        except Exception as e:
            db.session.rollback()
            flash(f'Error updating room: {str(e)}', 'danger')

    return render_template('admin/room_form.html', room=room, hostels=hostels_list)

@admin_bp.route('/rooms/delete/<int:room_id>', methods=['POST'])
@admin_required
def delete_room(room_id):
    room = db.session.get(Room, room_id)
    if not room:
        flash('Room not found.', 'danger')
        return redirect(url_for('admin.rooms'))

    if room.occupied_beds > 0:
        flash('Cannot delete room with active occupants. Please vacate first.', 'danger')
        return redirect(url_for('admin.rooms'))

    try:
        hostel_id = room.hostel_id
        db.session.delete(room)
        db.session.commit()
        flash('Room deleted successfully.', 'success')
        return redirect(url_for('admin.rooms', hostel_id=hostel_id))
    except Exception as e:
        db.session.rollback()
        flash(f'Error deleting room: {str(e)}', 'danger')
        return redirect(url_for('admin.rooms'))

# ==================== APPLICATIONS MANAGEMENT ====================
@admin_bp.route('/applications')
@admin_required
def applications():
    status = request.args.get('status', 'All')
    search = request.args.get('search', '').strip()

    query = Application.query
    if status and status != 'All':
        query = query.filter_by(status=status)
    if search:
        query = query.join(Student).filter(
            (Student.full_name.ilike(f'%{search}%')) |
            (Student.student_id.ilike(f'%{search}%'))
        )

    apps_list = query.order_by(Application.applied_at.desc()).all()
    
    # Counts for tab badges
    pending_count = Application.query.filter_by(status='Pending').count()
    approved_count = Application.query.filter_by(status='Approved').count()
    allocated_count = Application.query.filter_by(status='Allocated').count()
    rejected_count = Application.query.filter_by(status='Rejected').count()
    total_count = Application.query.count()

    return render_template('admin/applications.html',
        applications=apps_list,
        current_status=status,
        search=search,
        pending_count=pending_count,
        approved_count=approved_count,
        allocated_count=allocated_count,
        rejected_count=rejected_count,
        total_count=total_count
    )

@admin_bp.route('/applications/<int:app_id>/approve', methods=['POST'])
@admin_required
def approve_application(app_id):
    application = db.session.get(Application, app_id)
    if not application:
        flash('Application not found.', 'danger')
        return redirect(url_for('admin.applications'))

    remarks = request.form.get('admin_remarks', 'Approved by administrator. Ready for room allocation.')
    application.status = 'Approved'
    application.admin_remarks = remarks
    application.reviewed_at = datetime.utcnow()

    notify_user(
        user_id=application.student.user_id,
        title="Hostel Application Approved",
        message="Your hostel accommodation application has been approved! Room allocation will be processed shortly.",
        notification_type="success",
        link="/student/application-status"
    )

    db.session.commit()
    flash(f'Application #{app_id} for {application.student.full_name} approved successfully.', 'success')
    return redirect(url_for('admin.applications'))

@admin_bp.route('/applications/<int:app_id>/reject', methods=['POST'])
@admin_required
def reject_application(app_id):
    application = db.session.get(Application, app_id)
    if not application:
        flash('Application not found.', 'danger')
        return redirect(url_for('admin.applications'))

    remarks = request.form.get('admin_remarks', 'Application could not be approved due to unavailability of requested preferences.')
    application.status = 'Rejected'
    application.admin_remarks = remarks
    application.reviewed_at = datetime.utcnow()

    notify_user(
        user_id=application.student.user_id,
        title="Hostel Application Update",
        message=f"Your hostel application was not approved. Remarks: {remarks}",
        notification_type="danger",
        link="/student/application-status"
    )

    db.session.commit()
    flash(f'Application #{app_id} rejected.', 'info')
    return redirect(url_for('admin.applications'))

# ==================== SMART ROOM ALLOCATION ====================
@admin_bp.route('/smart-allocation')
@admin_required
def smart_allocation():
    # Applications waiting for allocation (Approved or Pending)
    pending_apps = Application.query.filter(Application.status.in_(['Approved', 'Pending'])).order_by(
        Application.academic_score.desc(),
        Application.applied_at.asc()
    ).all()

    # Available rooms
    available_rooms = Room.query.filter(
        Room.occupied_beds < Room.capacity,
        Room.status != 'Maintenance'
    ).order_by(Room.hostel_id.asc(), Room.room_number.asc()).all()

    # Active Allocations
    active_allocations = Allocation.query.filter_by(status='Active').order_by(Allocation.allocated_date.desc()).all()
    hostels_list = Hostel.query.all()

    return render_template('admin/smart_allocation.html',
        pending_apps=pending_apps,
        available_rooms=available_rooms,
        active_allocations=active_allocations,
        hostels=hostels_list
    )

@admin_bp.route('/smart-allocation/run', methods=['POST'])
@admin_required
def run_smart_allocation():
    """
    Intelligent room allocation engine:
    1. Fetches candidate applications (Approved or Pending) sorted by merit (academic_score) and application time.
    2. Matches student gender with hostel type (Boys -> Boys, Girls -> Girls).
    3. Respects student preferred hostel first, then other eligible hostels.
    4. Matches preferred room type (Single, Double, Triple) first, then fallback to any available room.
    5. Prevents duplicate allocation if student already has active allocation.
    6. Updates room occupied_beds, status, application status to 'Allocated', creates Allocation record.
    7. Sends immediate notification to student.
    """
    include_pending = request.form.get('include_pending') == 'on'
    statuses = ['Approved', 'Pending'] if include_pending else ['Approved']

    applications = Application.query.filter(Application.status.in_(statuses)).order_by(
        Application.academic_score.desc(),
        Application.distance_from_home_km.desc(),
        Application.applied_at.asc()
    ).all()

    if not applications:
        flash('No eligible applications found for allocation. Please approve pending applications first or select "Include Pending".', 'warning')
        return redirect(url_for('admin.smart_allocation'))

    allocated_count = 0
    skipped_already_allocated = 0
    failed_no_room = 0
    details = []

    for app in applications:
        student = app.student
        if not student:
            continue

        # Prevent duplicate
        if student.active_allocation:
            skipped_already_allocated += 1
            app.status = 'Allocated'
            continue

        # Gender to hostel type mapping
        required_type = 'Boys' if student.gender == 'Male' else 'Girls'

        # Candidate hostels: preferred hostel first if gender matches, then others of same type
        candidate_hostels = []
        if app.preferred_hostel and app.preferred_hostel.hostel_type == required_type:
            candidate_hostels.append(app.preferred_hostel)
        
        other_hostels = Hostel.query.filter(
            Hostel.hostel_type == required_type,
            Hostel.id != (app.preferred_hostel_id if app.preferred_hostel else -1)
        ).all()
        candidate_hostels.extend(other_hostels)

        target_room = None
        # 1. Search for preferred room type first in candidate hostels
        for hostel in candidate_hostels:
            room = Room.query.filter(
                Room.hostel_id == hostel.id,
                Room.room_type == app.preferred_room_type,
                Room.occupied_beds < Room.capacity,
                Room.status != 'Maintenance'
            ).order_by(Room.floor.asc(), Room.room_number.asc()).first()
            if room:
                target_room = room
                break

        # 2. If preferred room type not available, look for any available room in candidate hostels
        if not target_room:
            for hostel in candidate_hostels:
                room = Room.query.filter(
                    Room.hostel_id == hostel.id,
                    Room.occupied_beds < Room.capacity,
                    Room.status != 'Maintenance'
                ).order_by(Room.floor.asc(), Room.room_number.asc()).first()
                if room:
                    target_room = room
                    break

        if target_room:
            # Allocate
            target_room.occupied_beds += 1
            target_room.update_status()

            bed_num = f"Bed-{target_room.occupied_beds}"
            allocation = Allocation(
                student_id=student.id,
                room_id=target_room.id,
                hostel_id=target_room.hostel_id,
                bed_number=bed_num,
                academic_year='2024-2025',
                status='Active',
                allocated_by_id=session.get('user_id')
            )
            db.session.add(allocation)

            app.status = 'Allocated'
            app.admin_remarks = f"Automatically allocated via Smart Engine to {target_room.hostel.name}, Room {target_room.room_number} ({bed_num})."
            app.reviewed_at = datetime.utcnow()

            notify_user(
                user_id=student.user_id,
                title="Room Allocated Successfully!",
                message=f"Congratulations! You have been allocated {target_room.hostel.name}, Room {target_room.room_number} ({bed_num}).",
                notification_type="success",
                link="/student/room-details"
            )

            allocated_count += 1
            details.append(f"{student.full_name} ({student.student_id}) -> {target_room.hostel.name} {target_room.room_number}")
        else:
            failed_no_room += 1

    try:
        db.session.commit()
        msg = f"Smart Allocation completed! Successfully allocated {allocated_count} student(s)."
        if failed_no_room > 0:
            msg += f" {failed_no_room} student(s) could not be allocated due to insufficient available rooms for {required_type} hostels."
        if skipped_already_allocated > 0:
            msg += f" ({skipped_already_allocated} already had active allocations)."
        flash(msg, 'success' if allocated_count > 0 else 'warning')
    except Exception as e:
        db.session.rollback()
        flash(f"Error during smart allocation: {str(e)}", 'danger')

    return redirect(url_for('admin.smart_allocation'))

@admin_bp.route('/smart-allocation/manual', methods=['POST'])
@admin_required
def manual_allocation():
    student_id = request.form.get('student_id', type=int)
    room_id = request.form.get('room_id', type=int)
    bed_number = request.form.get('bed_number', '').strip()
    academic_year = request.form.get('academic_year', '2024-2025').strip()

    student = db.session.get(Student, student_id)
    room = db.session.get(Room, room_id)

    if not student or not room:
        flash('Invalid student or room selection.', 'danger')
        return redirect(url_for('admin.smart_allocation'))

    if student.active_allocation:
        flash(f'Student {student.full_name} already has an active room allocation ({student.active_allocation.room.room_number}). Vacate existing room first.', 'danger')
        return redirect(url_for('admin.smart_allocation'))

    # Check gender compatibility
    hostel = room.hostel
    if (student.gender == 'Male' and hostel.hostel_type == 'Girls') or (student.gender == 'Female' and hostel.hostel_type == 'Boys'):
        flash(f'Gender mismatch! Cannot allocate {student.gender} student to a {hostel.hostel_type} hostel.', 'danger')
        return redirect(url_for('admin.smart_allocation'))

    if room.occupied_beds >= room.capacity:
        flash(f'Room {room.room_number} is already full.', 'danger')
        return redirect(url_for('admin.smart_allocation'))

    if not bed_number:
        bed_number = f"Bed-{room.occupied_beds + 1}"

    try:
        room.occupied_beds += 1
        room.update_status()

        allocation = Allocation(
            student_id=student.id,
            room_id=room.id,
            hostel_id=room.hostel_id,
            bed_number=bed_number,
            academic_year=academic_year,
            status='Active',
            allocated_by_id=session.get('user_id')
        )
        db.session.add(allocation)

        # Update application status if exists
        app = student.latest_application
        if app and app.status in ['Pending', 'Approved']:
            app.status = 'Allocated'
            app.admin_remarks = f'Manually allocated by Administrator to {hostel.name}, Room {room.room_number}.'
            app.reviewed_at = datetime.utcnow()

        notify_user(
            user_id=student.user_id,
            title="Room Allocated Successfully!",
            message=f"You have been allocated to {hostel.name}, Room {room.room_number} ({bed_number}).",
            notification_type="success",
            link="/student/room-details"
        )

        db.session.commit()
        flash(f'Successfully allocated {student.full_name} to {hostel.name}, Room {room.room_number} ({bed_number}).', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Error during allocation: {str(e)}', 'danger')

    return redirect(url_for('admin.smart_allocation'))

@admin_bp.route('/allocations/<int:alloc_id>/vacate', methods=['POST'])
@admin_required
def vacate_allocation(alloc_id):
    allocation = db.session.get(Allocation, alloc_id)
    if not allocation:
        flash('Allocation record not found.', 'danger')
        return redirect(url_for('admin.smart_allocation'))

    try:
        allocation.status = 'Vacated'
        allocation.vacated_date = datetime.utcnow()

        room = allocation.room
        if room and room.occupied_beds > 0:
            room.occupied_beds -= 1
            room.update_status()

        notify_user(
            user_id=allocation.student.user_id,
            title="Room Allocation Vacated",
            message=f"Your room allocation for {allocation.hostel.name}, Room {room.room_number} has been vacated.",
            notification_type="info",
            link="/student/dashboard"
        )

        db.session.commit()
        flash(f'Allocation for {allocation.student.full_name} vacated successfully. Room bed capacity updated.', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Error vacating allocation: {str(e)}', 'danger')

    return redirect(url_for('admin.smart_allocation'))

# ==================== COMPLAINTS ====================
@admin_bp.route('/complaints')
@admin_required
def complaints():
    status = request.args.get('status', 'All')
    category = request.args.get('category', 'All')
    hostel_id = request.args.get('hostel_id', type=int)

    query = Complaint.query
    if status != 'All':
        query = query.filter_by(status=status)
    if category != 'All':
        query = query.filter_by(category=category)
    if hostel_id:
        query = query.filter_by(hostel_id=hostel_id)

    complaints_list = query.order_by(Complaint.created_at.desc()).all()
    hostels_list = Hostel.query.all()

    return render_template('admin/complaints.html',
        complaints=complaints_list,
        hostels=hostels_list,
        selected_status=status,
        selected_category=category,
        selected_hostel=hostel_id
    )

@admin_bp.route('/complaints/<int:complaint_id>/update', methods=['POST'])
@admin_required
def update_complaint(complaint_id):
    complaint = db.session.get(Complaint, complaint_id)
    if not complaint:
        flash('Complaint not found.', 'danger')
        return redirect(url_for('admin.complaints'))

    status = request.form.get('status', complaint.status)
    remarks = request.form.get('warden_remarks', '').strip()

    complaint.status = status
    if remarks:
        complaint.warden_remarks = remarks
    if status == 'Resolved':
        complaint.resolved_at = datetime.utcnow()

    notify_user(
        user_id=complaint.student.user_id,
        title=f"Complaint #{complaint.id} Status Updated",
        message=f"Status: {status}. Remarks: {remarks or 'No remarks'}",
        notification_type="success" if status == 'Resolved' else "info",
        link="/student/complaints"
    )

    db.session.commit()
    flash(f'Complaint #{complaint.id} updated.', 'success')
    return redirect(url_for('admin.complaints'))

# ==================== NOTICES ====================
@admin_bp.route('/notices', methods=['GET', 'POST'])
@admin_required
def notices():
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        content = request.form.get('content', '').strip()
        target_audience = request.form.get('target_audience', 'All')
        category = request.form.get('category', 'General')

        if not title or not content:
            flash('Title and Content are required.', 'warning')
            return redirect(url_for('admin.notices'))

        try:
            notice = Notice(
                title=title,
                content=content,
                target_audience=target_audience,
                category=category,
                posted_by_id=session.get('user_id')
            )
            db.session.add(notice)
            db.session.commit()
            flash('Notice published successfully to notice board.', 'success')
        except Exception as e:
            db.session.rollback()
            flash(f'Error publishing notice: {str(e)}', 'danger')

        return redirect(url_for('admin.notices'))

    notices_list = Notice.query.order_by(Notice.created_at.desc()).all()
    return render_template('admin/notices.html', notices=notices_list)

@admin_bp.route('/notices/delete/<int:notice_id>', methods=['POST'])
@admin_required
def delete_notice(notice_id):
    notice = db.session.get(Notice, notice_id)
    if notice:
        db.session.delete(notice)
        db.session.commit()
        flash('Notice removed successfully.', 'info')
    return redirect(url_for('admin.notices'))

# ==================== REPORTS & ANALYTICS ====================
@admin_bp.route('/reports')
@admin_required
def reports():
    hostels_list = Hostel.query.all()
    allocations_list = Allocation.query.filter_by(status='Active').all()
    available_rooms = Room.query.filter(Room.occupied_beds < Room.capacity, Room.status != 'Maintenance').all()

    total_capacity = sum(h.total_capacity for h in hostels_list)
    total_occupied = sum(h.total_occupied_beds for h in hostels_list)
    overall_occupancy_rate = round((total_occupied / total_capacity * 100), 1) if total_capacity > 0 else 0

    return render_template('admin/reports.html',
        hostels=hostels_list,
        allocations=allocations_list,
        available_rooms=available_rooms,
        total_capacity=total_capacity,
        total_occupied=total_occupied,
        overall_occupancy_rate=overall_occupancy_rate
    )

@admin_bp.route('/reports/export/allocations')
@admin_required
def export_allocations_csv():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Student ID', 'Student Name', 'Department', 'Year', 'Gender', 'Hostel', 'Room', 'Bed', 'Academic Year', 'Allocated Date', 'Status'])

    allocations = Allocation.query.order_by(Allocation.allocated_date.desc()).all()
    for a in allocations:
        s = a.student
        writer.writerow([
            s.student_id if s else 'N/A',
            s.full_name if s else 'N/A',
            s.department if s else 'N/A',
            s.year_of_study if s else 'N/A',
            s.gender if s else 'N/A',
            a.hostel.name if a.hostel else 'N/A',
            a.room.room_number if a.room else 'N/A',
            a.bed_number,
            a.academic_year,
            a.allocated_date.strftime('%Y-%m-%d %H:%M') if a.allocated_date else '',
            a.status
        ])

    response = make_response(output.getvalue())
    response.headers['Content-Disposition'] = f'attachment; filename=hostel_allocations_{datetime.now().strftime("%Y%m%d")}.csv'
    response.headers['Content-Type'] = 'text/csv'
    return response

@admin_bp.route('/reports/export/occupancy')
@admin_required
def export_occupancy_csv():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Hostel Name', 'Type', 'Floors', 'Total Rooms', 'Total Beds', 'Occupied Beds', 'Available Beds', 'Occupancy Rate (%)'])

    for h in Hostel.query.all():
        writer.writerow([
            h.name,
            h.hostel_type,
            h.total_floors,
            h.total_rooms_count,
            h.total_capacity,
            h.total_occupied_beds,
            h.available_beds_count,
            f"{h.occupancy_rate}%"
        ])

    response = make_response(output.getvalue())
    response.headers['Content-Disposition'] = f'attachment; filename=hostel_occupancy_{datetime.now().strftime("%Y%m%d")}.csv'
    response.headers['Content-Type'] = 'text/csv'
    return response

@admin_bp.route('/reports/export/rooms')
@admin_required
def export_rooms_csv():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Hostel', 'Room Number', 'Floor', 'Room Type', 'Capacity', 'Occupied', 'Available', 'Status', 'Price/Sem'])

    for r in Room.query.order_by(Room.hostel_id, Room.room_number).all():
        writer.writerow([
            r.hostel.name if r.hostel else 'N/A',
            r.room_number,
            r.floor,
            r.room_type,
            r.capacity,
            r.occupied_beds,
            r.available_beds,
            r.status,
            f"Rs. {r.price_per_semester}"
        ])

    response = make_response(output.getvalue())
    response.headers['Content-Disposition'] = f'attachment; filename=hostel_rooms_{datetime.now().strftime("%Y%m%d")}.csv'
    response.headers['Content-Type'] = 'text/csv'
    return response

