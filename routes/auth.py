from functools import wraps
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, g
from models import db, User, Student, Warden, Notification

auth_bp = Blueprint('auth', __name__)

def get_current_user():
    user_id = session.get('user_id')
    if user_id:
        return db.session.get(User, user_id)
    return None

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('auth.login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in first.', 'warning')
            return redirect(url_for('auth.login'))
        if session.get('role') != 'admin':
            flash('Access denied. Administrator privileges required.', 'danger')
            return redirect(url_for('main.index'))
        return f(*args, **kwargs)
    return decorated_function

def student_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in first.', 'warning')
            return redirect(url_for('auth.login'))
        if session.get('role') != 'student':
            flash('Access denied. Student portal only.', 'danger')
            return redirect(url_for('main.index'))
        return f(*args, **kwargs)
    return decorated_function

def warden_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in first.', 'warning')
            return redirect(url_for('auth.login'))
        if session.get('role') != 'warden':
            flash('Access denied. Warden privileges required.', 'danger')
            return redirect(url_for('main.index'))
        return f(*args, **kwargs)
    return decorated_function

def notify_user(user_id, title, message, notification_type='info', link=None):
    """Helper to create and commit a notification for any user."""
    try:
        notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            link=link
        )
        db.session.add(notif)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error creating notification: {e}")

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        role = session.get('role')
        if role == 'admin':
            return redirect(url_for('admin.dashboard'))
        elif role == 'warden':
            return redirect(url_for('warden.dashboard'))
        else:
            return redirect(url_for('student.dashboard'))

    if request.method == 'POST':
        username_or_email = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        remember = bool(request.form.get('remember'))

        if not username_or_email or not password:
            flash('Please enter both username/email and password.', 'warning')
            return render_template('login.html')

        user = User.query.filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()

        if user and user.check_password(password):
            if not user.is_active:
                flash('Your account has been deactivated. Please contact the administrator.', 'danger')
                return render_template('login.html')

            session.clear()
            session['user_id'] = user.id
            session['username'] = user.username
            session['role'] = user.role
            session['display_name'] = user.display_name
            session.permanent = remember

            flash(f'Welcome back, {user.display_name}!', 'success')

            # Role-based redirect
            if user.role == 'admin':
                return redirect(url_for('admin.dashboard'))
            elif user.role == 'warden':
                return redirect(url_for('warden.dashboard'))
            else:
                return redirect(url_for('student.dashboard'))
        else:
            flash('Invalid username/email or password. Please try again.', 'danger')

    return render_template('login.html')

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if 'user_id' in session:
        return redirect(url_for('main.index'))

    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        student_id = request.form.get('student_id', '').strip().upper()
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        phone = request.form.get('phone', '').strip()
        gender = request.form.get('gender', 'Male')
        department = request.form.get('department', '').strip()
        year_of_study = request.form.get('year_of_study', 1, type=int)
        address = request.form.get('address', '').strip()
        parent_name = request.form.get('parent_name', '').strip()
        parent_phone = request.form.get('parent_phone', '').strip()
        emergency_contact = request.form.get('emergency_contact', '').strip()

        # Validation
        if not full_name or not student_id or not username or not email or not password or not phone or not department:
            flash('Please fill in all required fields marked with *.', 'warning')
            return render_template('register.html')

        if password != confirm_password:
            flash('Passwords do not match. Please re-enter.', 'danger')
            return render_template('register.html')

        if len(password) < 6:
            flash('Password must be at least 6 characters long.', 'danger')
            return render_template('register.html')

        # Check existing user
        if User.query.filter_by(username=username).first():
            flash('Username is already taken. Please choose another.', 'danger')
            return render_template('register.html')

        if User.query.filter_by(email=email).first():
            flash('Email address is already registered. Please log in or use another email.', 'danger')
            return render_template('register.html')

        if Student.query.filter_by(student_id=student_id).first():
            flash(f'Student ID "{student_id}" is already registered.', 'danger')
            return render_template('register.html')

        try:
            # Create user
            user = User(
                username=username,
                email=email,
                role='student'
            )
            user.set_password(password)
            db.session.add(user)
            db.session.flush()  # Get user.id

            # Create student profile
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

            # Add welcome notification
            notif = Notification(
                user_id=user.id,
                title="Welcome to Smart Hostel Allocation System",
                message="Your student account has been created successfully. You can now apply for hostel accommodation.",
                notification_type="success",
                link="/student/apply"
            )
            db.session.add(notif)

            db.session.commit()
            flash('Registration successful! You can now log in with your credentials.', 'success')
            return redirect(url_for('auth.login'))

        except Exception as e:
            db.session.rollback()
            flash(f'An error occurred during registration: {str(e)}', 'danger')

    return render_template('register.html')

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out successfully.', 'info')
    return redirect(url_for('auth.login'))

