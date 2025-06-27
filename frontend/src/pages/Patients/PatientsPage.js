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
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
} from "../../services/api";

const patientSchema = Yup.object().shape({
  first_name: Yup.string().required("Required"),
  last_name: Yup.string().required("Required"),
  date_of_birth: Yup.date().required("Required"),
  medical_record_number: Yup.string().required("Required"),
});

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (currentPatient) {
        await updatePatient(currentPatient.id, values);
      } else {
        await addPatient(values);
      }
      const { data } = await getPatients(); 
      setPatients(data);
      handleClose();
    } catch (error) {
      console.error("Error saving patient:", error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await deletePatient(id);
      const { data } = await getPatients(); 
      setPatients(data);
    } catch (error) {
      console.error(
        "Error deleting patient:",
        error.response?.data || error.message
      );
    }
  };

  const handleOpen = (patient = null) => {
    setCurrentPatient(patient);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentPatient(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Patients
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Add Patient
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Medical Record #</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((pat) => (
              <TableRow key={pat.id}>
                <TableCell>{pat.first_name}</TableCell>
                <TableCell>{pat.last_name}</TableCell>
                <TableCell>
                  {new Date(pat.date_of_birth).toLocaleDateString()}
                </TableCell>
                <TableCell>{pat.medical_record_number}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(pat)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(pat.id)}>
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
          {currentPatient ? "Edit Patient" : "Add Patient"}
        </DialogTitle>
        <Formik
          initialValues={{
            first_name: currentPatient?.first_name || "",
            last_name: currentPatient?.last_name || "",
            date_of_birth:
              currentPatient?.date_of_birth?.split("T")[0] ||
              new Date().toISOString().split("T")[0],
            medical_record_number: currentPatient?.medical_record_number || "",
          }}
          validationSchema={patientSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="first_name"
                  label="First Name"
                  fullWidth
                  margin="normal"
                  error={touched.first_name && !!errors.first_name}
                  helperText={touched.first_name && errors.first_name}
                />
                <Field
                  as={TextField}
                  name="last_name"
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  error={touched.last_name && !!errors.last_name}
                  helperText={touched.last_name && errors.last_name}
                />
                <Field
                  as={TextField}
                  name="date_of_birth"
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  error={touched.date_of_birth && !!errors.date_of_birth}
                  helperText={touched.date_of_birth && errors.date_of_birth}
                />
                <Field
                  as={TextField}
                  name="medical_record_number"
                  label="Medical Record #"
                  fullWidth
                  margin="normal"
                  error={
                    touched.medical_record_number &&
                    !!errors.medical_record_number
                  }
                  helperText={
                    touched.medical_record_number &&
                    errors.medical_record_number
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {currentPatient ? "Update" : "Add"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

export default PatientsPage;
