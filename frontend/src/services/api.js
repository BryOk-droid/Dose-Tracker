import axios from "axios";

// Set the base URL to your backend domain ONLY
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Medications
export const getMedications = () => api.get("/medications");
export const addMedication = (data) => api.post("/medications", data);
export const updateMedication = (id, data) =>
  api.put(`/medications/${id}`, data);
export const deleteMedication = (id) => api.delete(`/medications/${id}`);

// Patients
export const getPatients = () => api.get("/patients");
export const addPatient = (data) => api.post("/patients", data);
export const updatePatient = (id, data) => api.put(`/patients/${id}`, data);
export const updateDosage = (id, data) => api.put(`/dosages/${id}`, data);
export const deletePatient = (id) => api.delete(`/patients/${id}`);

// Dosages
export const getDosages = () => api.get("/dosages");
export const addDosage = (data) => api.post("/dosages", data);
export const deleteDosage = (id) => api.delete(`/dosages/${id}`);

// Alerts
export const getAlerts = () => api.get("/alerts");

export default api;
