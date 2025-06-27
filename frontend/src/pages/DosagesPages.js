// frontend/src/pages/DosagesPage.js
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
  MenuItem,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  getDosages,
  addDosage,
  getMedications,
  getPatients,
} from "../services/api";

const dosageSchema = Yup.object().shape({
  medication_id: Yup.number().required("Required"),
  patient_id: Yup.number().required("Required"),
  dosage_amount: Yup.number().required("Required").min(0, "Must be positive"),
  dosage_time: Yup.string().required("Required"),
  administered_by: Yup.string().required("Required"),
  notes: Yup.string(),
});

const DosagesPage = () => {
  const [dosages, setDosages] = useState([]);
  const [medications, setMedications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchDosages();
    fetchMedications();
    fetchPatients();
  }, []);

  const fetchDosages = async () => {
    try {
      const { data } = await getDosages();
      setDosages(data);
    } catch (error) {
      console.error("Error fetching dosages:", error);
    }
  };

  const fetchMedications = async () => {
    try {
      const { data } = await getMedications();
      setMedications(data);
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

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
      await addDosage(values);
      fetchDosages();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding dosage:", error);
    }
    setSubmitting(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dosages
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Add Dosage
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Medication</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Dosage Amount</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Administered By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dosages.map((dos) => (
              <TableRow key={dos.id}>
                <TableCell>
                  {medications.find((m) => m.id === dos.medication_id)?.name}
                </TableCell>
                <TableCell>
                  {patients.find((p) => p.id === dos.patient_id)?.first_name}{" "}
                  {patients.find((p) => p.id === dos.patient_id)?.last_name}
                </TableCell>
                <TableCell>{dos.dosage_amount}</TableCell>
                <TableCell>
                  {new Date(dos.dosage_time).toLocaleString()}
                </TableCell>
                <TableCell>{dos.administered_by}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Dosage</DialogTitle>
        <Formik
          initialValues={{
            medication_id: "",
            patient_id: "",
            dosage_amount: "",
            dosage_time: new Date().toISOString().slice(0, 16),
            administered_by: "",
            notes: "",
          }}
          validationSchema={dosageSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, values }) => (
            <Form>
              <DialogContent>
                <Field
                  as={TextField}
                  name="medication_id"
                  label="Medication"
                  select
                  fullWidth
                  margin="normal"
                  error={touched.medication_id && !!errors.medication_id}
                  helperText={touched.medication_id && errors.medication_id}
                >
                  {medications.map((med) => (
                    <MenuItem key={med.id} value={med.id}>
                      {med.name}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  as={TextField}
                  name="patient_id"
                  label="Patient"
                  select
                  fullWidth
                  margin="normal"
                  error={touched.patient_id && !!errors.patient_id}
                  helperText={touched.patient_id && errors.patient_id}
                >
                  {patients.map((pat) => (
                    <MenuItem key={pat.id} value={pat.id}>
                      {pat.first_name} {pat.last_name}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  as={TextField}
                  name="dosage_amount"
                  label="Dosage Amount"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={touched.dosage_amount && !!errors.dosage_amount}
                  helperText={touched.dosage_amount && errors.dosage_amount}
                />
                <Field
                  as={TextField}
                  name="dosage_time"
                  label="Dosage Time"
                  type="datetime-local"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  error={touched.dosage_time && !!errors.dosage_time}
                  helperText={touched.dosage_time && errors.dosage_time}
                />
                <Field
                  as={TextField}
                  name="administered_by"
                  label="Administered By"
                  fullWidth
                  margin="normal"
                  error={touched.administered_by && !!errors.administered_by}
                  helperText={touched.administered_by && errors.administered_by}
                />
                <Field
                  as={TextField}
                  name="notes"
                  label="Notes"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
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

export default DosagesPage;
