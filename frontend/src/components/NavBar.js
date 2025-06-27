import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Medication Tracker
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/medications">
          Medications
        </Button>
        <Button color="inherit" component={Link} to="/patients">
          Patients
        </Button>
        <Button color="inherit" component={Link} to="/dosages">
          Dosages
        </Button>
        <Button color="inherit" component={Link} to="/alerts">
          Alerts
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
