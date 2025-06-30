from flask import Flask, jsonify
from extensions import db
from flask_migrate import Migrate
from flask_cors import CORS
import os
from datetime import timedelta
import logging
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv 
load_dotenv()

def create_app(test_config=None):
    """Application factory function"""
    app = Flask(__name__)
    
  
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY') or 'dev_key',
        SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL') or 'sqlite:///medications.db',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SQLALCHEMY_ENGINE_OPTIONS={'pool_pre_ping': True},
        CORS_ORIGINS=[
            "http://localhost:3000",
            "https://medication-2uz1.onrender.com"],
    )
    
  
    db.init_app(app)
    migrate = Migrate(app, db)
    
    @app.before_first_request
    def run_migrations():
        from flask_migrate import upgrade
        upgrade()

    CORS(app, resources={
        r"/api/*": {
            "origins": app.config['CORS_ORIGINS'],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
   
    from routes import init_routes
    app.register_blueprint(init_routes(), url_prefix='/api')
    
    
    @app.route('/')
    def home():
        return jsonify({
            "message": "Medication Tracker API",
            "status": "running",
            "version": "1.0",
            "endpoints": {
                "medications": {
                    "GET": "/api/medications",
                    "POST": "/api/medications"
                },
                "patients": {
                    "GET": "/api/patients",
                    "POST": "/api/patients"
                },
                "dosages": {
                    "GET": "/api/dosages",
                    "POST": "/api/dosages"
                },
                "alerts": {
                    "GET": "/api/alerts"
                }
            }
        })
    
   
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "error": "Not found",
            "message": "The requested resource was not found",
            "status": 404
        }), 404
    
   
    if not app.debug:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler(
            'logs/medication_tracker.log',
            maxBytes=10240,
            backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Medication Tracker startup')
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)