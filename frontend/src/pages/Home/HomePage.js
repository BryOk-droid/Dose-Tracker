import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  getMedications,
  getPatients,
  getDosages,
  getAlerts,
} from "../../services/api";
import SummaryCard from "../../components/SummaryCard";
import {
  Medication as MedicationIcon,
  People as PeopleIcon,
  LocalHospital as DosageIcon,
  Warning as AlertIcon,
} from "@mui/icons-material";

const HomePage = () => {
  const [stats, setStats] = useState({
    medications: 0,
    patients: 0,
    dosages: 0,
    alerts: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medsRes, patientsRes, dosagesRes, alertsRes] = await Promise.all(
          [getMedications(), getPatients(), getDosages(), getAlerts()]
        );

        setStats({
          medications: medsRes.data.length,
          patients: patientsRes.data.length,
          dosages: dosagesRes.data.length,
          alerts: alertsRes.data.length,
          loading: false,
          error: null,
        });
      } catch (error) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load dashboard data",
        }));
      }
    };

    fetchData();
  }, []);

  if (stats.loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (stats.error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {stats.error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Medication Tracker Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Overview of your medication management system
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Medications"
            value={stats.medications}
            icon={<MedicationIcon fontSize="inherit" />}
            color="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Patients"
            value={stats.patients}
            icon={<PeopleIcon fontSize="inherit" />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Dosages"
            value={stats.dosages}
            icon={<DosageIcon fontSize="inherit" />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Alerts"
            value={stats.alerts}
            icon={<AlertIcon fontSize="inherit" />}
            color="#f44336"
          />
        </Grid>
      </Grid>

      {stats.alerts > 0 && (
        <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            <AlertIcon color="error" sx={{ verticalAlign: "middle", mr: 1 }} />
            Low Stock Alerts
          </Typography>
          <Alert severity="warning">
            You have {stats.alerts} medication(s) with low stock. Please check
            the Alerts page for details.
          </Alert>
        </Paper>
      )}
    </Box>
  );
};

export default HomePage;
