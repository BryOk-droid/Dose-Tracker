import { Formik, Form, Field } from "formik";
import { TextField, Button, Box } from "@mui/material";
import * as Yup from "yup";
import { addMedication, updateMedication } from "../../services/api";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  current_stock: Yup.number().required("Required").min(0),
  threshold: Yup.number().required("Required").min(0),
});

export default function MedicationForm({ medication, onSuccess }) {
  return (
    <Formik
      initialValues={{
        name: medication?.name || "",
        description: medication?.description || "",
        current_stock: medication?.current_stock || 0,
        threshold: medication?.threshold || 0,
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          if (medication) {
            await updateMedication(medication.id, values);
          } else {
            await addMedication(values);
          }
          onSuccess();
        } catch (error) {
          console.error("Error saving medication:", error);
        }
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Field
              as={TextField}
              name="name"
              label="Name"
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
            />
            <Field
              as={TextField}
              name="description"
              label="Description"
              multiline
              rows={3}
            />
            <Field
              as={TextField}
              name="current_stock"
              label="Current Stock"
              type="number"
              error={touched.current_stock && !!errors.current_stock}
              helperText={touched.current_stock && errors.current_stock}
            />
            <Field
              as={TextField}
              name="threshold"
              label="Threshold"
              type="number"
              error={touched.threshold && !!errors.threshold}
              helperText={touched.threshold && errors.threshold}
            />
            <Button type="submit" variant="contained">
              {medication ? "Update" : "Add"} Medication
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
