# Update backend/routes.py
from flask import jsonify, request
from models import db, Medication, Patient, Dosage
from datetime import datetime

def init_routes(app):
    @app.route('/')
    def home():
        return jsonify({"message": "Medication Tracker API"})
    
    # Medication CRUD
    @app.route('/medications', methods=['GET'])
    def get_medications():
        medications = Medication.query.all()
        return jsonify([{
            'id': med.id,
            'name': med.name,
            'description': med.description,
            'current_stock': med.current_stock,
            'threshold': med.threshold
        } for med in medications])
    
    @app.route('/medications/<int:id>', methods=['GET'])
    def get_medication(id):
        medication = Medication.query.get_or_404(id)
        return jsonify({
            'id': medication.id,
            'name': medication.name,
            'description': medication.description,
            'current_stock': medication.current_stock,
            'threshold': medication.threshold
        })
    
    @app.route('/medications', methods=['POST'])
    def add_medication():
        data = request.get_json()
        medication = Medication(
            name=data['name'],
            description=data.get('description', ''),
            current_stock=data['current_stock'],
            threshold=data['threshold']
        )
        db.session.add(medication)
        db.session.commit()
        return jsonify({"message": "Medication added successfully"}), 201
    
    @app.route('/medications/<int:id>', methods=['PUT'])
    def update_medication(id):
        medication = Medication.query.get_or_404(id)
        data = request.get_json()
        medication.name = data.get('name', medication.name)
        medication.description = data.get('description', medication.description)
        medication.current_stock = data.get('current_stock', medication.current_stock)
        medication.threshold = data.get('threshold', medication.threshold)
        db.session.commit()
        return jsonify({"message": "Medication updated successfully"})
    
    @app.route('/medications/<int:id>', methods=['DELETE'])
    def delete_medication(id):
        medication = Medication.query.get_or_404(id)
        db.session.delete(medication)
        db.session.commit()
        return jsonify({"message": "Medication deleted successfully"})
    
    # Patient routes
    @app.route('/patients', methods=['GET'])
    def get_patients():
        patients = Patient.query.all()
        return jsonify([{
            'id': pat.id,
            'first_name': pat.first_name,
            'last_name': pat.last_name,
            'date_of_birth': pat.date_of_birth.isoformat(),
            'medical_record_number': pat.medical_record_number
        } for pat in patients])
    
    @app.route('/patients', methods=['POST'])
    def add_patient():
        data = request.get_json()
        patient = Patient(
            first_name=data['first_name'],
            last_name=data['last_name'],
            date_of_birth=datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date(),
            medical_record_number=data['medical_record_number']
        )
        db.session.add(patient)
        db.session.commit()
        return jsonify({"message": "Patient added successfully"}), 201
    
    # Dosage routes
    @app.route('/dosages', methods=['GET'])
    def get_dosages():
        dosages = Dosage.query.all()
        return jsonify([{
            'id': dos.id,
            'medication_id': dos.medication_id,
            'patient_id': dos.patient_id,
            'dosage_amount': dos.dosage_amount,
            'dosage_time': dos.dosage_time.isoformat(),
            'administered_by': dos.administered_by,
            'notes': dos.notes
        } for dos in dosages])
    
    @app.route('/dosages', methods=['POST'])
    def add_dosage():
        data = request.get_json()
        dosage = Dosage(
            medication_id=data['medication_id'],
            patient_id=data['patient_id'],
            dosage_amount=data['dosage_amount'],
            dosage_time=datetime.strptime(data['dosage_time'], '%Y-%m-%d %H:%M:%S'),
            administered_by=data['administered_by'],
            notes=data.get('notes', '')
        )
        db.session.add(dosage)
        db.session.commit()
        return jsonify({"message": "Dosage added successfully"}), 201
    
    # Alerts route
    @app.route('/alerts', methods=['GET'])
    def get_alerts():
        medications = Medication.query.filter(Medication.current_stock < Medication.threshold).all()
        return jsonify([{
            'id': med.id,
            'name': med.name,
            'current_stock': med.current_stock,
            'threshold': med.threshold
        } for med in medications])