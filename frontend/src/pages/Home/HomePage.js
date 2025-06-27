// frontend/src/pages/HomePage.js
import { getAlerts } from "../../services/api";
import { Typography, Box } from "@mui/material";

const HomePage = () => {
  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Medication Tracker System
      </Typography>
      <Typography variant="body1">
        Welcome to the Medication Tracker system. Use the navigation bar to
        manage medications, patients, dosages, and view low stock alerts.
      </Typography>
    </Box>
  );
};

export default HomePage;
