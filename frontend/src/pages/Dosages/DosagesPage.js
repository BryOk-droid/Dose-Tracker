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
  IconButton,
  Alert
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  getDosages,
  addDosage,
  updateDosage,
  deleteDosage,
  getMedications,
  getPatients,
} from "../../services/api";

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
  const [currentDosage, setCurrentDosage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dosagesRes, medsRes, patientsRes] = await Promise.all([
          getDosages(),
          getMedications(),
          getPatients(),
        ]);
        setDosages(dosagesRes.data);
        setMedications(medsRes.data);
        setPatients(patientsRes.data);
      } catch (error) {
        setError("Failed to load data");
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      const payload = {
        medication_id: Number(values.medication_id),
        patient_id: Number(values.patient_id),
        dosage_amount: Number(values.dosage_amount),
        dosage_time: values.dosage_time,
        administered_by: values.administered_by,
        notes: values.notes || "",
      };

      if (currentDosage) {
        await updateDosage(currentDosage.id, payload);
      } else {
        await addDosage(payload);
      }

      // Refresh data
      const { data } = await getDosages();
      setDosages(data);
      handleClose();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to save dosage");
      console.error("Error saving dosage:", {
        error: error.response?.data || error.message,
        payload: values,
      });
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await deleteDosage(id);
      const { data } = await getDosages();
      setDosages(data);
    } catch (error) {
      setError("Failed to delete dosage");
      console.error(
        "Error deleting dosage:",
        error.response?.data || error.message
      );
    }
  };

  const handleOpen = (dosage = null) => {
    setCurrentDosage(dosage);
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentDosage(null);
    setError(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dosages
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpen()}
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
              <TableCell>Actions</TableCell>
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
                <TableCell>
                  <IconButton onClick={() => handleOpen(dos)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(dos.id)}>
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
          {currentDosage ? "Edit Dosage" : "Add Dosage"}
        </DialogTitle>
        <Formik
          initialValues={{
            medication_id: currentDosage?.medication_id || "",
            patient_id: currentDosage?.patient_id || "",
            dosage_amount: currentDosage?.dosage_amount || "",
            dosage_time: currentDosage?.dosage_time
              ? new Date(currentDosage.dosage_time).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16),
            administered_by: currentDosage?.administered_by || "",
            notes: currentDosage?.notes || "",
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
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {currentDosage ? "Update" : "Add"}
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
