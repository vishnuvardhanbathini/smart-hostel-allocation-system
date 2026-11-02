from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from models import db, User, Warden, Hostel, Room, Allocation, Student, Complaint, Notice, Notification
from routes.auth import warden_required, notify_user

warden_bp = Blueprint('warden', __name__, url_prefix='/warden')

def get_current_warden():
    user_id = session.get('user_id')
    if user_id:
        return Warden.query.filter_by(user_id=user_id).first()
    return None

@warden_bp.route('/dashboard')
@warden_required
def dashboard():
    warden = get_current_warden()
    if not warden:
        flash('Warden profile not found.', 'danger')
        return redirect(url_for('auth.logout'))

    hostel = warden.assigned_hostel

    total_rooms = hostel.total_rooms_count if hostel else 0
    total_capacity = hostel.total_capacity if hostel else 0
    occupied_beds = hostel.total_occupied_beds if hostel else 0
    available_beds = hostel.available_beds_count if hostel else 0
    occupancy_rate = hostel.occupancy_rate if hostel else 0

    # Assigned students count
    assigned_students_count = 0
    if hostel:
        assigned_students_count = Allocation.query.filter_by(hostel_id=hostel.id, status='Active').count()

    # Pending complaints
    complaints_query = Complaint.query
    if hostel:
        complaints_query = complaints_query.filter_by(hostel_id=hostel.id)
    
    pending_complaints_count = complaints_query.filter(Complaint.status != 'Resolved').count()
    recent_complaints = complaints_query.order_by(Complaint.created_at.desc()).limit(5).all()

    # Rooms summary
    rooms = hostel.rooms.all() if hostel else []

    return render_template('warden/dashboard.html',
        warden=warden,
        hostel=hostel,
        total_rooms=total_rooms,
        total_capacity=total_capacity,
        occupied_beds=occupied_beds,
        available_beds=available_beds,
        occupancy_rate=occupancy_rate,
        assigned_students_count=assigned_students_count,
        pending_complaints_count=pending_complaints_count,
        recent_complaints=recent_complaints,
        rooms=rooms
    )

@warden_bp.route('/rooms')
@warden_required
def rooms():
    warden = get_current_warden()
    if not warden or not warden.assigned_hostel:
        flash('You are not assigned to any hostel yet. Please contact the administrator.', 'warning')
        return redirect(url_for('warden.dashboard'))

    hostel = warden.assigned_hostel
    floor = request.args.get('floor', type=int)
    status = request.args.get('status', '').strip()

    query = Room.query.filter_by(hostel_id=hostel.id)
    if floor:
        query = query.filter_by(floor=floor)
    if status:
        query = query.filter_by(status=status)

    rooms_list = query.order_by(Room.floor.asc(), Room.room_number.asc()).all()

    return render_template('warden/rooms.html',
        warden=warden,
        hostel=hostel,
        rooms=rooms_list,
        selected_floor=floor,
        selected_status=status
    )

@warden_bp.route('/students')
@warden_required
def students():
    warden = get_current_warden()
    if not warden or not warden.assigned_hostel:
        flash('You are not assigned to any hostel yet.', 'warning')
        return redirect(url_for('warden.dashboard'))

    hostel = warden.assigned_hostel
    search = request.args.get('search', '').strip()

    allocations_query = Allocation.query.filter_by(hostel_id=hostel.id, status='Active')
    if search:
        allocations_query = allocations_query.join(Student).filter(
            (Student.full_name.ilike(f'%{search}%')) |
            (Student.student_id.ilike(f'%{search}%')) |
            (Student.department.ilike(f'%{search}%'))
        )

    allocations = allocations_query.order_by(Allocation.allocated_date.desc()).all()

    return render_template('warden/students.html',
        warden=warden,
        hostel=hostel,
        allocations=allocations,
        search=search
    )

@warden_bp.route('/complaints')
@warden_required
def complaints():
    warden = get_current_warden()
    if not warden:
        return redirect(url_for('auth.logout'))

    hostel = warden.assigned_hostel
    status = request.args.get('status', 'All')
    category = request.args.get('category', 'All')

    query = Complaint.query
    if hostel:
        query = query.filter_by(hostel_id=hostel.id)

    if status != 'All':
        query = query.filter_by(status=status)
    if category != 'All':
        query = query.filter_by(category=category)

    complaints_list = query.order_by(Complaint.created_at.desc()).all()

    return render_template('warden/complaints.html',
        warden=warden,
        hostel=hostel,
        complaints=complaints_list,
        selected_status=status,
        selected_category=category
    )

@warden_bp.route('/complaints/<int:complaint_id>/update', methods=['POST'])
@warden_required
def update_complaint(complaint_id):
    warden = get_current_warden()
    complaint = db.session.get(Complaint, complaint_id)
    if not complaint:
        flash('Complaint not found.', 'danger')
        return redirect(url_for('warden.complaints'))

    status = request.form.get('status', complaint.status)
    remarks = request.form.get('warden_remarks', '').strip()

    complaint.status = status
    if remarks:
        complaint.warden_remarks = f"[{warden.full_name}]: {remarks}"
    if status == 'Resolved':
        complaint.resolved_at = datetime.utcnow()

    notify_user(
        user_id=complaint.student.user_id,
        title=f"Complaint #{complaint.id} Updated by Warden",
        message=f"Status: {status}. Remarks: {remarks or 'Updated by warden.'}",
        notification_type="success" if status == 'Resolved' else "info",
        link="/student/complaints"
    )

    db.session.commit()
    flash(f'Complaint #{complaint.id} status updated to {status}.', 'success')
    return redirect(url_for('warden.complaints'))

@warden_bp.route('/notices', methods=['GET', 'POST'])
@warden_required
def notices():
    warden = get_current_warden()
    if not warden:
        return redirect(url_for('auth.logout'))

    hostel = warden.assigned_hostel

    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        content = request.form.get('content', '').strip()
        category = request.form.get('category', 'General')
        target_audience = 'Boys Hostel' if (hostel and hostel.hostel_type == 'Boys') else ('Girls Hostel' if (hostel and hostel.hostel_type == 'Girls') else 'All')

        if not title or not content:
            flash('Title and content are required.', 'warning')
            return redirect(url_for('warden.notices'))

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
            flash('Notice published to hostel notice board.', 'success')
        except Exception as e:
            db.session.rollback()
            flash(f'Error publishing notice: {str(e)}', 'danger')

        return redirect(url_for('warden.notices'))

    notices_list = Notice.query.order_by(Notice.created_at.desc()).all()
    return render_template('warden/notices.html', warden=warden, hostel=hostel, notices=notices_list)

