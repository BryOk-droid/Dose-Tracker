# 💊 Medication Tracker App

A full-stack web application to manage patients, medications, dosages, and medication alerts.

- Backend: Flask + SQLAlchemy + PostgreSQL
- Frontend: React + Axios + Formik + MUI
- API: RESTful endpoints for CRUD operations
- DB: SQLite (for local dev) or PostgreSQL (for deployment)

---

## 🛠 Features

- Create, update, and delete **patients**, **medications**, and **dosages**
- Display real-time alerts for missed or upcoming medication
- Responsive UI with search and sorting
- Backend follows MVC structure and RESTful best practices

---
## Getting Started
### 1. Clone the Repo
```bash
git clone https://github.com/BryOk-droid/Dose-Tracker.git
cd Dose-Tracker
```
## Backend Setup
### Install Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
## Environment Variables
Create a .env file in the backend/ folder:
```bash
DATABASE_URL=sqlite:///medications.db
SECRET_KEY=supersecretkey
```
Or use PostgreSQL:
```bash
DATABASE_URL=postgresql://<username>:<password>@<host>/<database_name>
```
## Migrate the Database
```bash
flask db init        
flask db migrate -m "Initial migration"
flask db upgrade
```
## Run Backend
```bash
flask run --port 5002
```
## Frontend Setup
Install Dependencies
```bash
cd ../frontend
npm install
```
### Environment Variables
Create a .env.local file in frontend/:
```bash
REACT_APP_API_URL=http://localhost:5002/api
```
If deployed:
```bash
REACT_APP_API_URL=https://your-api-url.onrender.com/api
```
###
Start React App
```bash
npm start
```
### 📡 API Endpoints

| Method | Endpoint               | Description           |
|--------|------------------------|-----------------------|
| GET    | `/api/patients`        | List all patients     |
| POST   | `/api/patients`        | Create a new patient  |
| PUT    | `/api/patients/:id`    | Update patient info   |
| DELETE | `/api/patients/:id`    | Delete a patient      |
| GET    | `/api/medications`     | List all medications  |
| POST   | `/api/medications`     | Create new medication |
| DELETE | `/api/medications/:id` | Delete medication     |
| GET    | `/api/dosages`         | List all dosages      |
| POST   | `/api/dosages`         | Add dosage            |
| PUT    | `/api/dosages/:id`     | Update dosage         |
| DELETE | `/api/dosages/:id`     | Delete dosage         |
| GET    | `/api/alerts`          | Fetch alerts          |

## Credits
Built with 💙 by Brian Okoth Omuga

2025 Full-Stack Flask Capstone Project
## License
MIT License — Free to use & improve.

