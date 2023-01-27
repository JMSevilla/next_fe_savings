import React from "react";
import { Button, Box } from "@mui/material";

type Props = {
  activeStep: number;
  steps: any;
  handleNext: () => void;
  handleBack: () => void;
  isDisabled?: any;
};

const NextPreviousButton: React.FC<Props> = (props) => {
  const { activeStep, steps, handleNext, handleBack, isDisabled } = props;
  return (
    <>
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
        <Button onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </Box>
    </>
  );
};

export default NextPreviousButton;
