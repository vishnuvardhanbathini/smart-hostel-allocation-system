from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from models import db, User, Student, Warden, Hostel, Room, Application, Allocation, Complaint, Notice, Notification
from routes.auth import student_required, notify_user

student_bp = Blueprint('student', __name__, url_prefix='/student')

def get_current_student():
    user_id = session.get('user_id')
    if user_id:
        return Student.query.filter_by(user_id=user_id).first()
    return None

@student_bp.route('/dashboard')
@student_required
def dashboard():
    student = get_current_student()
    if not student:
        flash('Student profile not found. Please contact administration.', 'danger')
        return redirect(url_for('auth.logout'))

    active_allocation = student.active_allocation
    latest_app = student.latest_application

    # Find roommates if allocated
    roommates = []
    warden = None
    if active_allocation and active_allocation.room:
        roommates = [
            alloc.student for alloc in active_allocation.room.allocations.filter_by(status='Active').all()
            if alloc.student_id != student.id
        ]
        if active_allocation.hostel:
            warden = Warden.query.filter_by(hostel_id=active_allocation.hostel_id).first()

    recent_complaints = student.complaints.limit(4).all()

    # Notices targeting this student's gender/hostel
    hostel_filter = 'Boys Hostel' if student.gender == 'Male' else 'Girls Hostel'
    notices = Notice.query.filter(
        Notice.target_audience.in_(['All', hostel_filter])
    ).order_by(Notice.created_at.desc()).limit(4).all()

    return render_template('student/dashboard.html',
        student=student,
        allocation=active_allocation,
        latest_app=latest_app,
        roommates=roommates,
        warden=warden,
        recent_complaints=recent_complaints,
        notices=notices
    )

@student_bp.route('/profile', methods=['GET', 'POST'])
@student_required
def profile():
    student = get_current_student()
    if not student:
        return redirect(url_for('auth.logout'))

    if request.method == 'POST':
        student.phone = request.form.get('phone', student.phone).strip()
        student.address = request.form.get('address', '').strip()
        student.parent_name = request.form.get('parent_name', '').strip()
        student.parent_phone = request.form.get('parent_phone', '').strip()
        student.emergency_contact = request.form.get('emergency_contact', '').strip()

        # Update password if provided
        new_password = request.form.get('new_password', '').strip()
        if new_password:
            if len(new_password) < 6:
                flash('Password must be at least 6 characters.', 'danger')
                return render_template('student/profile.html', student=student)
            student.user.set_password(new_password)
            flash('Password updated successfully.', 'info')

        try:
            db.session.commit()
            flash('Your profile details have been updated successfully.', 'success')
            return redirect(url_for('student.profile'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error updating profile: {str(e)}', 'danger')

    return render_template('student/profile.html', student=student)

@student_bp.route('/apply', methods=['GET', 'POST'])
@student_required
def apply():
    student = get_current_student()
    if not student:
        return redirect(url_for('auth.logout'))

    # Check if student already has active allocation
    if student.active_allocation:
        flash(f'You already have an active room allocation in {student.active_allocation.hostel.name}, Room {student.active_allocation.room.room_number}.', 'info')
        return redirect(url_for('student.room_details'))

    # Check if student already has a pending or approved application
    existing_app = Application.query.filter(
        Application.student_id == student.id,
        Application.status.in_(['Pending', 'Approved'])
    ).first()

    if existing_app:
        flash('You have an active application in review. Please check your application status.', 'info')
        return redirect(url_for('student.application_status'))

    # Eligible hostels matching gender
    required_type = 'Boys' if student.gender == 'Male' else 'Girls'
    eligible_hostels = Hostel.query.filter_by(hostel_type=required_type).all()

    if request.method == 'POST':
        preferred_hostel_id = request.form.get('preferred_hostel_id', type=int)
        preferred_room_type = request.form.get('preferred_room_type', 'Double')
        academic_score = request.form.get('academic_score', 7.5, type=float)
        distance_from_home_km = request.form.get('distance_from_home_km', 50.0, type=float)
        special_remarks = request.form.get('special_remarks', '').strip()

        if not preferred_hostel_id:
            flash('Please select a preferred hostel.', 'warning')
            return render_template('student/apply.html', student=student, hostels=eligible_hostels)

        try:
            application = Application(
                student_id=student.id,
                preferred_hostel_id=preferred_hostel_id,
                preferred_room_type=preferred_room_type,
                academic_score=academic_score,
                distance_from_home_km=distance_from_home_km,
                special_remarks=special_remarks,
                status='Pending'
            )
            db.session.add(application)

            notify_user(
                user_id=student.user_id,
                title="Application Submitted",
                message=f"Your hostel application has been received and is currently under review by the hostel administration.",
                notification_type="info",
                link="/student/application-status"
            )

            db.session.commit()
            flash('Hostel application submitted successfully! You can track the status below.', 'success')
            return redirect(url_for('student.application_status'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error submitting application: {str(e)}', 'danger')

    return render_template('student/apply.html', student=student, hostels=eligible_hostels)

@student_bp.route('/application-status')
@student_required
def application_status():
    student = get_current_student()
    if not student:
        return redirect(url_for('auth.logout'))

    applications = student.applications.all()
    latest_app = student.latest_application
    active_allocation = student.active_allocation

    return render_template('student/status.html',
        student=student,
        applications=applications,
        latest_app=latest_app,
        allocation=active_allocation
    )

@student_bp.route('/room-details')
@student_required
def room_details():
    student = get_current_student()
    if not student:
        return redirect(url_for('auth.logout'))

    allocation = student.active_allocation
    if not allocation:
        flash('You do not have an active room allocation yet. Please apply for a hostel first.', 'info')
        return redirect(url_for('student.apply'))

    room = allocation.room
    hostel = allocation.hostel
    warden = Warden.query.filter_by(hostel_id=hostel.id).first() if hostel else None

    # Roommates
    roommates = [
        alloc.student for alloc in room.allocations.filter_by(status='Active').all()
        if alloc.student_id != student.id
    ]

    return render_template('student/room_details.html',
        student=student,
        allocation=allocation,
        room=room,
        hostel=hostel,
        warden=warden,
        roommates=roommates
    )

@student_bp.route('/complaints', methods=['GET', 'POST'])
@student_required
def complaints():
    student = get_current_student()
    if not student:
        return redirect(url_for('auth.logout'))

    allocation = student.active_allocation

    if request.method == 'POST':
        category = request.form.get('category', 'Maintenance')
        priority = request.form.get('priority', 'Medium')
        title = request.form.get('title', '').strip()
        description = request.form.get('description', '').strip()
        room_number = request.form.get('room_number', '').strip()

        if not room_number and allocation:
            room_number = allocation.room.room_number

        if not title or not description:
            flash('Please provide both a title and detailed description for your complaint.', 'warning')
            return redirect(url_for('student.complaints'))

        try:
            complaint = Complaint(
                student_id=student.id,
                hostel_id=allocation.hostel_id if allocation else None,
                room_number=room_number,
                category=category,
                priority=priority,
                title=title,
                description=description,
                status='Pending'
            )
            db.session.add(complaint)

            notify_user(
                user_id=student.user_id,
                title="Complaint Registered",
                message=f'Your complaint "{title}" has been registered and forwarded to the hostel warden.',
                notification_type="info",
                link="/student/complaints"
            )

            db.session.commit()
            flash('Complaint submitted successfully. The warden has been notified.', 'success')
            return redirect(url_for('student.complaints'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error registering complaint: {str(e)}', 'danger')

    complaints_list = student.complaints.all()
    return render_template('student/complaints.html',
        student=student,
        complaints=complaints_list,
        allocation=allocation
    )

@student_bp.route('/notices')
@student_required
def notices():
    student = get_current_student()
    if not student:
        return redirect(url_for('auth.logout'))

    hostel_target = 'Boys Hostel' if student.gender == 'Male' else 'Girls Hostel'
    notices_list = Notice.query.filter(
        Notice.target_audience.in_(['All', hostel_target])
    ).order_by(Notice.created_at.desc()).all()

    return render_template('student/notices.html', student=student, notices=notices_list)

@student_bp.route('/notifications')
@student_required
def notifications():
    user = User.query.get(session.get('user_id'))
    if not user:
        return redirect(url_for('auth.login'))

    notifications_list = user.notifications.all()
    # Mark all as read
    for n in notifications_list:
        n.is_read = True
    db.session.commit()

    return render_template('student/notifications.html', notifications=notifications_list)

