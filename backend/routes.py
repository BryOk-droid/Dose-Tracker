from flask import Blueprint, request, jsonify
from models import Medication, Patient, Dosage
from extensions import db
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

def init_routes():
    bp = Blueprint('routes', __name__)

    # Medication Routes (unchanged)
    @bp.route('/medications', methods=['GET'])
    def get_medications():
        medications = Medication.query.all()
        return jsonify([med.to_dict() for med in medications])

    @bp.route('/medications', methods=['POST'])
    def add_medication():
        data = request.get_json()
        try:
            medication = Medication(
                name=data['name'],
                description=data.get('description'),
                current_stock=data['current_stock'],
                threshold=data['threshold']
            )
            db.session.add(medication)
            db.session.commit()
            return jsonify(medication.to_dict()), 201
        except (KeyError, TypeError) as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'error': 'Database error'}), 500

    @bp.route('/medications/<int:id>', methods=['PUT'])
    def update_medication(id):
        medication = Medication.query.get_or_404(id)
        data = request.get_json()
        try:
            medication.update_from_dict(data)
            db.session.commit()
            return jsonify(medication.to_dict())
        except (KeyError, TypeError) as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'error': 'Database error'}), 500

    @bp.route('/medications/<int:id>', methods=['DELETE'])
    def delete_medication(id):
        medication = Medication.query.get_or_404(id)
        try:
            db.session.delete(medication)
            db.session.commit()
            return jsonify({'message': 'Medication deleted'}), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'error': 'Database error'}), 500

    # Patient Routes (unchanged)
    @bp.route('/patients', methods=['GET'])
    def get_patients():
        patients = Patient.query.all()
        return jsonify([pat.to_dict() for pat in patients])

    @bp.route('/patients', methods=['POST'])
    def add_patient():
        data = request.get_json()
        try:
            patient = Patient(
                first_name=data['first_name'],
                last_name=data['last_name'],
                date_of_birth=datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date(),
                medical_record_number=data['medical_record_number']
            )
            db.session.add(patient)
            db.session.commit()
            return jsonify(patient.to_dict()), 201
        except (KeyError, TypeError, ValueError) as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'error': 'Database error'}), 500

    @bp.route('/patients/<int:id>', methods=['PUT'])
    def update_patient(id):
        patient = Patient.query.get_or_404(id)
        data = request.get_json()
        try:
            patient.update_from_dict(data)
            db.session.commit()
            return jsonify(patient.to_dict())
        except (KeyError, TypeError, ValueError) as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'error': 'Database error'}), 500

    @bp.route('/patients/<int:id>', methods=['DELETE'])
    def delete_patient(id):
        patient = Patient.query.get_or_404(id)
        try:
            db.session.delete(patient)
            db.session.commit()
            return jsonify({'message': 'Patient deleted'}), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return jsonify({'error': 'Database error'}), 500

    # Dosage Routes (Fixed)
    @bp.route('/dosages', methods=['GET'])
    def get_dosages():
        dosages = Dosage.query.all()
        return jsonify([dosage.to_dict() for dosage in dosages])

    @bp.route('/dosages', methods=['POST'])
    def add_dosage():
        data = request.get_json()
        try:
            # Parse and validate datetime
            dosage_time = datetime.fromisoformat(data['dosage_time']) if 'T' in data['dosage_time'] \
                         else datetime.strptime(data['dosage_time'], '%Y-%m-%d %H:%M:%S')
            
            # Validate numeric fields
            medication_id = int(data['medication_id'])
            patient_id = int(data['patient_id'])
            dosage_amount = float(data['dosage_amount'])

            dosage = Dosage(
                medication_id=medication_id,
                patient_id=patient_id,
                dosage_amount=dosage_amount,
                dosage_time=dosage_time,
                administered_by=data['administered_by'],
                notes=data.get('notes', '')
            )
            
            db.session.add(dosage)
            
            # Update medication stock
            medication = Medication.query.get(medication_id)
            if medication:
                medication.current_stock -= dosage_amount
            
            db.session.commit()
            return jsonify(dosage.to_dict()), 201
            
        except ValueError as ve:
            db.session.rollback()
            return jsonify({'error': f'Invalid data format: {str(ve)}'}), 400
        except KeyError as ke:
            db.session.rollback()
            return jsonify({'error': f'Missing required field: {str(ke)}'}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

    @bp.route('/dosages/<int:id>', methods=['PUT'])
    def update_dosage(id):
        dosage = Dosage.query.get_or_404(id)
        data = request.get_json()
        try:
            # Handle datetime
            if 'dosage_time' in data:
                dosage.dosage_time = datetime.fromisoformat(data['dosage_time']) if 'T' in data['dosage_time'] \
                                   else datetime.strptime(data['dosage_time'], '%Y-%m-%d %H:%M:%S')
            
            # Handle medication change and stock adjustment
            if 'medication_id' in data or 'dosage_amount' in data:
                new_med_id = int(data.get('medication_id', dosage.medication_id))
                new_amount = float(data.get('dosage_amount', dosage.dosage_amount))
                
                # Restore old medication stock
                if dosage.medication_id != new_med_id or dosage.dosage_amount != new_amount:
                    old_med = Medication.query.get(dosage.medication_id)
                    if old_med:
                        old_med.current_stock += dosage.dosage_amount
                    
                    # Deduct from new medication
                    new_med = Medication.query.get(new_med_id)
                    if new_med:
                        new_med.current_stock -= new_amount
                
                dosage.medication_id = new_med_id
                dosage.dosage_amount = new_amount
            
            # Update other fields
            if 'patient_id' in data:
                dosage.patient_id = int(data['patient_id'])
            if 'administered_by' in data:
                dosage.administered_by = data['administered_by']
            if 'notes' in data:
                dosage.notes = data['notes']
            
            db.session.commit()
            return jsonify(dosage.to_dict())
            
        except ValueError as ve:
            db.session.rollback()
            return jsonify({'error': f'Invalid data format: {str(ve)}'}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400

    @bp.route('/dosages/<int:id>', methods=['DELETE'])
    def delete_dosage(id):
        dosage = Dosage.query.get_or_404(id)
        try:
            # Restore medication stock
            medication = Medication.query.get(dosage.medication_id)
            if medication:
                medication.current_stock += dosage.dosage_amount
            
            db.session.delete(dosage)
            db.session.commit()
            return jsonify({'message': 'Dosage deleted'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    # Alerts Route
    @bp.route('/alerts', methods=['GET'])
    def get_alerts():
        medications = Medication.query.filter(
            Medication.current_stock < Medication.threshold
        ).all()
        return jsonify([med.to_dict() for med in medications])

    return bp