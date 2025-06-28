import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";
import NavBar from "./components/NavBar";
import HomePage from "./pages/Home/HomePage";
import MedicationsPage from "./pages/Medications/MedicationsPage";
import PatientsPage from "./pages/Patients/PatientsPage";
import DosagesPage from "./pages/Dosages/DosagesPage";
import AlertsPage from "./pages/Alerts/AlertsPage";

function App() {
  return (
    <Router>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/medications" element={<MedicationsPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/dosages" element={<DosagesPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
