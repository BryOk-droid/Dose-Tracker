// frontend/src/pages/MedicationsPage.js
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  getMedications,
  addMedication,
  updateMedication,
  deleteMedication,
} from "../services/api";

const medicationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string(),
  current_stock: Yup.number().required("Required").min(0, "Cannot be negative"),
  threshold: Yup.number().required("Required").min(0, "Cannot be negative"),
});

const MedicationsPage = () => {
  const [medications, setMedications] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentMed, setCurrentMed] = useState(null);

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const { data } = await getMedications();
      setMedications(data);
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  const handleOpen = (medication = null) => {
    setCurrentMed(medication);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentMed(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (currentMed) {
        await updateMedication(currentMed.id, values);
      } else {
        await addMedication(values);
      }
      fetchMedications();
      handleClose();
    } catch (error) {
      console.error("Error saving medication:", error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedication(id);
      fetchMedications();
    } catch (error) {
      console.error("Error deleting medication:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Medications
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Add Medication
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Threshold</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medications.map((med) => (
              <TableRow key={med.id}>
                <TableCell>{med.name}</TableCell>
                <TableCell>{med.description}</TableCell>
                <TableCell>{med.current_stock}</TableCell>
                <TableCell>{med.threshold}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(med)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(med.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {currentMed ? "Edit Medication" : "Add Medication"}
        </DialogTitle>
        <Formik
          initialValues={{
            name: currentMed?.name || "",
            description: currentMed?.description || "",
            current_stock: currentMed?.current_stock || 0,
            threshold: currentMed?.threshold || 0,
          }}
          validationSchema={medicationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="name"
                  label="Name"
                  fullWidth
                  margin="normal"
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
                <Field
                  as={TextField}
                  name="description"
                  label="Description"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />
                <Field
                  as={TextField}
                  name="current_stock"
                  label="Current Stock"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={touched.current_stock && !!errors.current_stock}
                  helperText={touched.current_stock && errors.current_stock}
                />
                <Field
                  as={TextField}
                  name="threshold"
                  label="Threshold"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={touched.threshold && !!errors.threshold}
                  helperText={touched.threshold && errors.threshold}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {currentMed ? "Update" : "Add"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

export default MedicationsPage;
