
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Medication(db.Model):
    __tablename__ = 'medications'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    current_stock = db.Column(db.Integer, nullable=False)
    threshold = db.Column(db.Integer, nullable=False)
    
    dosages = db.relationship('Dosage', backref='medication', lazy=True)
    
    def __repr__(self):
        return f'<Medication {self.name}>'

class Patient(db.Model):
    __tablename__ = 'patients'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    medical_record_number = db.Column(db.String(50), unique=True, nullable=False)
    
    dosages = db.relationship('Dosage', backref='patient', lazy=True)
    
    def __repr__(self):
        return f'<Patient {self.first_name} {self.last_name}>'

class Dosage(db.Model):
    __tablename__ = 'dosages'
    
    id = db.Column(db.Integer, primary_key=True)
    medication_id = db.Column(db.Integer, db.ForeignKey('medications.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    dosage_amount = db.Column(db.Float, nullable=False)
    dosage_time = db.Column(db.DateTime, nullable=False)
    administered_by = db.Column(db.String(100), nullable=False)
    notes = db.Column(db.Text)
    
    def __repr__(self):
        return f'<Dosage {self.medication.name} for {self.patient.first_name}>'