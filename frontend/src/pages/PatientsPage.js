// frontend/src/pages/PatientsPage.js
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
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { getPatients, addPatient } from "../services/api";

const patientSchema = Yup.object().shape({
  first_name: Yup.string().required("Required"),
  last_name: Yup.string().required("Required"),
  date_of_birth: Yup.date().required("Required"),
  medical_record_number: Yup.string().required("Required"),
});

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);

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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await addPatient(values);
      fetchPatients();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding patient:", error);
    }
    setSubmitting(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Patients
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
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
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((pat) => (
              <TableRow key={pat.id}>
                <TableCell>{pat.first_name}</TableCell>
                <TableCell>{pat.last_name}</TableCell>
                <TableCell>{pat.date_of_birth}</TableCell>
                <TableCell>{pat.medical_record_number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Patient</DialogTitle>
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            date_of_birth: "",
            medical_record_number: "",
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
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  Add
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
