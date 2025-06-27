from extensions import db
from datetime import datetime

class Medication(db.Model):
    __tablename__ = 'medications'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    current_stock = db.Column(db.Integer, nullable=False)
    threshold = db.Column(db.Integer, nullable=False)
    
    dosages = db.relationship('Dosage', backref='medication', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Medication {self.name}>'
    
    def to_dict(self):
        """Serialize Medication object to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'current_stock': self.current_stock,
            'threshold': self.threshold,
            'low_stock': self.current_stock < self.threshold
        }
    
    def update_from_dict(self, data):
        """Update Medication from dictionary"""
        self.name = data.get('name', self.name)
        self.description = data.get('description', self.description)
        self.current_stock = data.get('current_stock', self.current_stock)
        self.threshold = data.get('threshold', self.threshold)
        return self


class Patient(db.Model):
    __tablename__ = 'patients'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    medical_record_number = db.Column(db.String(50), unique=True, nullable=False)
    
    dosages = db.relationship('Dosage', backref='patient', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Patient {self.first_name} {self.last_name}>'
    
    def to_dict(self):
        """Serialize Patient object to dictionary"""
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'date_of_birth': self.date_of_birth.isoformat(),
            'medical_record_number': self.medical_record_number,
            'full_name': f"{self.first_name} {self.last_name}"
        }
    
    def update_from_dict(self, data):
        """Update Patient from dictionary"""
        self.first_name = data.get('first_name', self.first_name)
        self.last_name = data.get('last_name', self.last_name)
        if 'date_of_birth' in data:
            self.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
        self.medical_record_number = data.get('medical_record_number', self.medical_record_number)
        return self


class Dosage(db.Model):
    __tablename__ = 'dosages'
    
    id = db.Column(db.Integer, primary_key=True)
    medication_id = db.Column(db.Integer, db.ForeignKey('medications.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    dosage_amount = db.Column(db.Float, nullable=False)
    dosage_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    administered_by = db.Column(db.String(100), nullable=False)
    notes = db.Column(db.Text)
    
    def __repr__(self):
        return f'<Dosage {self.medication.name} for {self.patient.first_name}>'
    
    def to_dict(self):
        """Serialize Dosage object to dictionary"""
        return {
            'id': self.id,
            'medication_id': self.medication_id,
            'patient_id': self.patient_id,
            'medication_name': self.medication.name if self.medication else None,
            'patient_name': f"{self.patient.first_name} {self.patient.last_name}" if self.patient else None,
            'dosage_amount': self.dosage_amount,
            'dosage_time': self.dosage_time.isoformat(),
            'administered_by': self.administered_by,
            'notes': self.notes,
            'formatted_time': self.dosage_time.strftime('%Y-%m-%d %H:%M')
        }
    
    def update_from_dict(self, data):
        """Update Dosage from dictionary"""
        self.medication_id = data.get('medication_id', self.medication_id)
        self.patient_id = data.get('patient_id', self.patient_id)
        self.dosage_amount = data.get('dosage_amount', self.dosage_amount)
        if 'dosage_time' in data:
            self.dosage_time = datetime.strptime(data['dosage_time'], '%Y-%m-%d %H:%M:%S')
        self.administered_by = data.get('administered_by', self.administered_by)
        self.notes = data.get('notes', self.notes)
        return self