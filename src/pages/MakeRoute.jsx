import React, { useState } from "react";

import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";

import { assignDriverToOrders } from "../utils/fetchOrders";

import {
  Header,
  CustomDatePicker,
  MakeRouteStep1,
  MakeRouteStep2,
  MakeRouteStep3,
  MakeRouteStep4,
  MakeRouteStep5,
} from "../components";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#4048F1",
      transition: "all 150ms",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#4048F1",
      transition: "all 150ms",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
    transition: "all 150ms",
  },
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#4048F1",
  }),

  transition: "all 150ms",
  "& .QontoStepIcon-completedIcon": {
    color: "#4048F1",
    zIndex: 1,
    fontSize: 18,
    transition: "all 150ms",
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
    transition: "all 150ms",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <>
          <Check className="QontoStepIcon-completedIcon" />
        </>
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const steps = [
  "Día",
  "Pedidos Faltantes",
  "Eliminar Duplicados",
  "Limpieza",
  "Asignar Choferes",
];

const MakeRoute = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const handleNext = () => {
    let newSkipped = skipped;
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    // navidate() redirect to route
    setActiveStep(0);
  };

  const [routeDay, setRouteDay] = useState(null);

  const [groupData, setGroupData] = useState([]);
  const [data, setData] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const handleAssignDriverToOrders = async () => {
    try {
      await assignDriverToOrders(groupData, data, drivers);
    } catch (error) {
      console.log(error);
    }
    navigate("/DashboardDailyRoute/" + routeDay.toISOString());
  };

  return (
    <>
      <div className="m-10 mt-5 p-10 pt-6 bg-white rounded-3xl">
        <div className="mb-5 flex justify-between">
          <Header category="Aplicaciones" title="Hacer Ruta" />
        </div>
        <div className="flex justify-center">
          <div className="lg:w-[calc(70%)] w-full">
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<QontoConnector />}
            >
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel
                      StepIconComponent={QontoStepIcon}
                      {...labelProps}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="lg:w-[calc(70%)] w-full">
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  Creación de Ruta Finalizada.
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleReset}>Ver Ruta</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  {activeStep === 0 ? (
                    <MakeRouteStep1
                      daySelectedCallback={(value) => setRouteDay(value)}
                    />
                  ) : activeStep === 1 ? (
                    <MakeRouteStep2 routeDay={routeDay} />
                  ) : activeStep === 2 ? (
                    <MakeRouteStep3 routeDay={routeDay} />
                  ) : activeStep === 3 ? (
                    <MakeRouteStep4 routeDay={routeDay} />
                  ) : activeStep === 4 ? (
                    <MakeRouteStep5
                      routeDay={routeDay}
                      callback={(callbackObject) => {
                        setGroupData(callbackObject.groupData);
                        setData(callbackObject.data);
                        setDrivers(callbackObject.drivers);
                        console.log("CALLBACK HAPPENED");
                      }}
                    />
                  ) : (
                    <div></div>
                  )}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />

                  {activeStep === steps.length - 1 ? (
                    <Button onClick={handleAssignDriverToOrders}>
                      Terminar
                    </Button>
                  ) : (
                    <Button onClick={handleNext}>Siguiente</Button>
                  )}
                </Box>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MakeRoute;
