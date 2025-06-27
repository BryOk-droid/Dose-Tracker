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
  Button,
} from "@mui/material";
import { getAlerts } from "../../services/api";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const { data } = await getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Low Stock Alerts</Typography>
        <Button variant="contained" onClick={fetchAlerts}>
          Refresh
        </Button>
      </Box>

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
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{alert.name}</TableCell>
                  <TableCell>{alert.current_stock}</TableCell>
                  <TableCell>{alert.threshold}</TableCell>
                  <TableCell>{alert.current_stock - alert.threshold}</TableCell>
                  <TableCell>
                    <Alert severity="error" sx={{ p: 0 }}>
                      Low Stock
                    </Alert>
                  </TableCell>
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
