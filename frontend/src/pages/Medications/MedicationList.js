import React, { useState, useEffect } from "react";
import { getMedications } from "../../../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

export default function MedicationsList() {
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMedications();
        setMedications(response.data);
      } catch (error) {
        console.error("Error fetching medications:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {medications.map((med) => (
            <TableRow key={med.id}>
              <TableCell>{med.name}</TableCell>
              <TableCell>{med.description}</TableCell>
              <TableCell>
                {med.current_stock} / {med.threshold}
              </TableCell>
              <TableCell>
                {med.current_stock < med.threshold ? (
                  <Chip label="Low Stock" color="error" size="small" />
                ) : (
                  <Chip label="In Stock" color="success" size="small" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
