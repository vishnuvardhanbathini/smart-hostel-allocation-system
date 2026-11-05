import os
import sys

# Ensure the project root directory is accessible on the Python import path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, '..'))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Import the initialized Flask application instance
from app import app

# 'app' is the WSGI entrypoint exposed for Vercel Serverless Functions

