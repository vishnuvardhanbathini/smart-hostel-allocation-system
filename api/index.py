import os
import sys

# Ensure the project root directory is accessible on the Python import path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, '..'))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from app import app
from werkzeug.middleware.proxy_fix import ProxyFix

class VercelPathFixer:
    """
    WSGI Middleware for Vercel serverless deployment.
    Normalizes PATH_INFO when Vercel rewrites requests to /api/index,
    ensuring Flask routes receive the exact user-requested path.
    """
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        # 1. Prefer the original client URI if forwarded by proxy
        forwarded = (
            environ.get('HTTP_X_FORWARDED_URI')
            or environ.get('RAW_URI')
            or environ.get('REQUEST_URI')
        )
        if forwarded:
            clean_path = forwarded.split('?')[0]
            if clean_path and not clean_path.startswith('/api/index'):
                environ['PATH_INFO'] = clean_path

        # 2. If PATH_INFO is literally /api/index or /api, map to /
        path_info = environ.get('PATH_INFO', '')
        if path_info in ('/api/index', '/api'):
            environ['PATH_INFO'] = '/'
        elif path_info.startswith('/api/index/'):
            environ['PATH_INFO'] = path_info[len('/api/index'):]

        return self.wsgi_app(environ, start_response)

# Apply proxy fix and path normalization for Vercel
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
app.wsgi_app = VercelPathFixer(app.wsgi_app)
