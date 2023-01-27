import React, { useState } from "react";
import { Stepper, Step, Button, Typography, StepLabel } from "@mui/material";

const steps = [
  "Personal Information",
  "Onhand Savings Deposit",
  "Credentials",
  "Finish",
];
type Props = {
  activeSteps: number;
  children: React.ReactNode;
};
const SystemStepper: React.FC<Props> = (props) => {
  const { activeSteps, children } = props;

  return (
    <>
      <Stepper activeStep={activeSteps}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {children}
    </>
  );
};

export default SystemStepper;
