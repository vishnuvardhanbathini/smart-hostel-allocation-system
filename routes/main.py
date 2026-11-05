from flask import Blueprint, render_template, session, redirect, url_for, flash
from models import db, Hostel, Room, Student, Allocation

main_bp = Blueprint('main', __name__)

@main_bp.route('/api/index')
@main_bp.route('/api')
@main_bp.route('/home')
@main_bp.route('/index')
@main_bp.route('/')
def index():
    # If already logged in, redirect to respective dashboard
    if 'user_id' in session:
        role = session.get('role')
        if role == 'admin':
            return redirect(url_for('admin.dashboard'))
        elif role == 'warden':
            return redirect(url_for('warden.dashboard'))
        else:
            return redirect(url_for('student.dashboard'))

    hostels = Hostel.query.order_by(Hostel.id.asc()).all()
    total_hostels = Hostel.query.count()
    total_rooms = Room.query.count()
    total_beds = sum(r.capacity for r in Room.query.all())
    active_residents = Allocation.query.filter_by(status='Active').count()

    return render_template('index.html',
        hostels=hostels,
        total_hostels=total_hostels,
        total_rooms=total_rooms,
        total_beds=total_beds,
        active_residents=active_residents
    )

@main_bp.route('/hostel/<int:hostel_id>')
def hostel_detail(hostel_id):
    hostel = db.session.get(Hostel, hostel_id)
    if not hostel:
        flash('Residence hall not found.', 'warning')
        return redirect(url_for('main.index'))
    return render_template('hostel_detail.html', hostel=hostel, Room=Room)
