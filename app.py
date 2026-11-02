import os
from flask import Flask, session
from models import db, User, Notification
from routes.auth import auth_bp, get_current_user
from routes.admin import admin_bp
from routes.student import student_bp
from routes.warden import warden_bp
from routes.main import main_bp
from seed_data import seed_database

def create_app(test_config=None):
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'smart_hostel_allocation_super_secret_key_sesd_2024'

    # Database setup in 'database' subfolder
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_dir = os.path.join(basedir, 'database')
    os.makedirs(db_dir, exist_ok=True)
    db_path = os.path.join(db_dir, 'hostel.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    if test_config:
        app.config.update(test_config)

    db.init_app(app)

    # Register Blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(warden_bp)

    # Context processor for templates
    @app.context_processor
    def inject_global_vars():
        user = get_current_user()
        unread_count = 0
        if user:
            unread_count = Notification.query.filter_by(user_id=user.id, is_read=False).count()
        return dict(
            current_user=user,
            unread_notifications_count=unread_count,
            current_year=2024
        )

    # Database initialization & automatic seeding
    with app.app_context():
        db.create_all()
        try:
            seed_database()
        except Exception as e:
            print(f"Notice during seeding: {e}")

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)

