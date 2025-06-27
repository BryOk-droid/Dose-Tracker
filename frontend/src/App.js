// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Container, Box } from "@mui/material";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import MedicationsPage from "./pages/MedicationsPage";
import PatientsPage from "./pages/PatientsPage";
import DosagesPage from "./pages/DosagesPage";
import AlertsPage from "./pages/AlertsPage";

function App() {
  return (
    <Router>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="lg">
        <Box my={4}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/medications" element={<MedicationsPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/dosages" element={<DosagesPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
