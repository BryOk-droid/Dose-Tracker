// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Medication endpoints
export const getMedications = () => api.get("/medications");
export const getMedication = (id) => api.get(`/medications/${id}`);
export const addMedication = (medication) =>
  api.post("/medications", medication);
export const updateMedication = (id, medication) =>
  api.put(`/medications/${id}`, medication);
export const deleteMedication = (id) => api.delete(`/medications/${id}`);

// Patient endpoints
export const getPatients = () => api.get("/patients");
export const addPatient = (patient) => api.post("/patients", patient);

// Dosage endpoints
export const getDosages = () => api.get("/dosages");
export const addDosage = (dosage) => api.post("/dosages", dosage);

// Alert endpoints
export const getAlerts = () => api.get("/alerts");

export default api;
