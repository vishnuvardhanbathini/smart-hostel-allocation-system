from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='student')  # 'admin', 'student', 'warden'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    # 1-to-1 profiles
    student_profile = db.relationship('Student', backref='user', uselist=False, cascade="all, delete-orphan")
    warden_profile = db.relationship('Warden', backref='user', uselist=False, cascade="all, delete-orphan")
    
    # 1-to-many
    notifications = db.relationship('Notification', backref='user', cascade="all, delete-orphan", lazy='dynamic', order_by='Notification.created_at.desc()')
    notices_posted = db.relationship('Notice', backref='posted_by', lazy='dynamic')
    allocations_made = db.relationship('Allocation', backref='allocated_by_user', foreign_keys='Allocation.allocated_by_id', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @property
    def display_name(self):
        if self.role == 'student' and self.student_profile:
            return self.student_profile.full_name
        elif self.role == 'warden' and self.warden_profile:
            return self.warden_profile.full_name
        return self.username

    def __repr__(self):
        return f'<User {self.username} ({self.role})>'


class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    student_id = db.Column(db.String(30), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    gender = db.Column(db.String(10), nullable=False)  # 'Male', 'Female', 'Other'
    department = db.Column(db.String(100), nullable=False)
    year_of_study = db.Column(db.Integer, nullable=False, default=1)  # 1, 2, 3, 4
    address = db.Column(db.Text, nullable=True)
    parent_name = db.Column(db.String(100), nullable=True)
    parent_phone = db.Column(db.String(20), nullable=True)
    emergency_contact = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    applications = db.relationship('Application', backref='student', cascade="all, delete-orphan", lazy='dynamic', order_by='Application.applied_at.desc()')
    allocations = db.relationship('Allocation', backref='student', cascade="all, delete-orphan", lazy='dynamic', order_by='Allocation.allocated_date.desc()')
    complaints = db.relationship('Complaint', backref='student', cascade="all, delete-orphan", lazy='dynamic', order_by='Complaint.created_at.desc()')

    @property
    def active_allocation(self):
        return self.allocations.filter_by(status='Active').first()

    @property
    def latest_application(self):
        return self.applications.first()

    def __repr__(self):
        return f'<Student {self.student_id} - {self.full_name}>'


class Warden(db.Model):
    __tablename__ = 'wardens'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True)
    warden_id = db.Column(db.String(30), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id', ondelete='SET NULL'), nullable=True)
    office_location = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Warden {self.warden_id} - {self.full_name}>'


class Hostel(db.Model):
    __tablename__ = 'hostels'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    hostel_type = db.Column(db.String(20), nullable=False)  # 'Boys', 'Girls', 'Co-ed'
    total_floors = db.Column(db.Integer, nullable=False, default=3)
    description = db.Column(db.Text, nullable=True)
    facilities = db.Column(db.Text, nullable=True)  # Comma separated
    image_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    rooms = db.relationship('Room', backref='hostel', cascade="all, delete-orphan", lazy='dynamic')
    applications = db.relationship('Application', backref='preferred_hostel', lazy='dynamic')
    allocations = db.relationship('Allocation', backref='hostel', lazy='dynamic')
    wardens = db.relationship('Warden', backref='assigned_hostel', lazy='dynamic')
    complaints = db.relationship('Complaint', backref='hostel', lazy='dynamic')

    @property
    def total_rooms_count(self):
        return self.rooms.count()

    @property
    def total_capacity(self):
        return sum(room.capacity for room in self.rooms.all())

    @property
    def total_occupied_beds(self):
        return sum(room.occupied_beds for room in self.rooms.all())

    @property
    def available_beds_count(self):
        return max(0, self.total_capacity - self.total_occupied_beds)

    @property
    def occupancy_rate(self):
        cap = self.total_capacity
        if cap == 0:
            return 0.0
        return round((self.total_occupied_beds / cap) * 100, 1)

    def __repr__(self):
        return f'<Hostel {self.name} ({self.hostel_type})>'


class Room(db.Model):
    __tablename__ = 'rooms'

    id = db.Column(db.Integer, primary_key=True)
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id', ondelete='CASCADE'), nullable=False)
    room_number = db.Column(db.String(20), nullable=False)
    floor = db.Column(db.Integer, nullable=False, default=1)
    room_type = db.Column(db.String(20), nullable=False)  # 'Single', 'Double', 'Triple', 'Four-Bed'
    capacity = db.Column(db.Integer, nullable=False, default=2)
    occupied_beds = db.Column(db.Integer, nullable=False, default=0)
    price_per_semester = db.Column(db.Float, nullable=False, default=15000.0)
    status = db.Column(db.String(20), nullable=False, default='Available')  # 'Available', 'Partially Occupied', 'Full', 'Maintenance'
    facilities = db.Column(db.String(255), nullable=True)

    # Relationships
    allocations = db.relationship('Allocation', backref='room', cascade="all, delete-orphan", lazy='dynamic')

    __table_args__ = (
        db.UniqueConstraint('hostel_id', 'room_number', name='uq_hostel_room_number'),
    )

    @property
    def available_beds(self):
        return max(0, self.capacity - self.occupied_beds)

    @property
    def is_available(self):
        return self.status != 'Maintenance' and self.available_beds > 0

    @property
    def active_occupants(self):
        return [alloc.student for alloc in self.allocations.filter_by(status='Active').all()]

    def update_status(self):
        if self.status == 'Maintenance':
            return
        if self.occupied_beds >= self.capacity:
            self.status = 'Full'
        elif self.occupied_beds > 0:
            self.status = 'Partially Occupied'
        else:
            self.status = 'Available'

    def __repr__(self):
        return f'<Room {self.room_number} - {self.room_type} ({self.status})>'


class Application(db.Model):
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    preferred_hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id', ondelete='CASCADE'), nullable=False)
    preferred_room_type = db.Column(db.String(20), nullable=False, default='Double')  # 'Single', 'Double', 'Triple'
    academic_score = db.Column(db.Float, nullable=False, default=7.5)  # CGPA e.g. 8.5
    distance_from_home_km = db.Column(db.Float, nullable=False, default=50.0)
    special_remarks = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='Pending')  # 'Pending', 'Approved', 'Rejected', 'Allocated'
    admin_remarks = db.Column(db.Text, nullable=True)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Application Student={self.student_id} Status={self.status}>'


class Allocation(db.Model):
    __tablename__ = 'allocations'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id', ondelete='CASCADE'), nullable=False)
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id', ondelete='CASCADE'), nullable=False)
    bed_number = db.Column(db.String(20), nullable=False, default='Bed-1')
    allocated_date = db.Column(db.DateTime, default=datetime.utcnow)
    academic_year = db.Column(db.String(20), nullable=False, default='2024-2025')
    status = db.Column(db.String(20), nullable=False, default='Active')  # 'Active', 'Vacated', 'Transferred'
    allocated_by_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    vacated_date = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Allocation Student={self.student_id} Room={self.room_id} Status={self.status}>'


class Complaint(db.Model):
    __tablename__ = 'complaints'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id', ondelete='SET NULL'), nullable=True)
    room_number = db.Column(db.String(20), nullable=True)
    category = db.Column(db.String(50), nullable=False)  # 'Electricity', 'Water supply', 'Cleaning', 'Internet', 'Maintenance', 'Other'
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(20), nullable=False, default='Medium')  # 'Low', 'Medium', 'High', 'Urgent'
    status = db.Column(db.String(20), nullable=False, default='Pending')  # 'Pending', 'In Progress', 'Resolved'
    warden_remarks = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<Complaint #{self.id} {self.category} ({self.status})>'


class Notice(db.Model):
    __tablename__ = 'notices'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable=False)
    target_audience = db.Column(db.String(50), nullable=False, default='All')  # 'All', 'Boys Hostel', 'Girls Hostel', 'Warden'
    category = db.Column(db.String(30), nullable=False, default='General')  # 'General', 'Urgent', 'Maintenance', 'Event'
    posted_by_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Notice {self.title} ({self.category})>'


class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    notification_type = db.Column(db.String(20), nullable=False, default='info')  # 'info', 'success', 'warning', 'danger'
    is_read = db.Column(db.Boolean, default=False)
    link = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Notification {self.title} to User {self.user_id}>'

