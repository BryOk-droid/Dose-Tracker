// frontend/src/pages/AlertsPage.js
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { getAlerts } from "../services/api";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data } = await getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Low Stock Alerts
      </Typography>

      {alerts.length === 0 ? (
        <Alert severity="success">No low stock alerts!</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Medication</TableCell>
                <TableCell>Current Stock</TableCell>
                <TableCell>Threshold</TableCell>
                <TableCell>Difference</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{alert.name}</TableCell>
                  <TableCell>{alert.current_stock}</TableCell>
                  <TableCell>{alert.threshold}</TableCell>
                  <TableCell>{alert.current_stock - alert.threshold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AlertsPage;
