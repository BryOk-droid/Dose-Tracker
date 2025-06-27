# backend/routes.py
from flask import jsonify, request
from models import db, Medication, Patient, Dosage

def init_routes(app):
    @app.route('/')
    def home():
        return jsonify({"message": "Medication Tracker API"})
    
    # We'll add more routes later