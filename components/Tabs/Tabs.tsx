import React, { useState } from "react";
import { Tabs, Tab, Typography, Box } from "@mui/material";

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};
type TabsProps = {
  children: React.ReactNode;
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
};
const SystemTabs: React.FC<TabsProps> = ({ children, value, handleChange }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Login" {...a11yProps(0)} />
          <Tab label="Open an account" {...a11yProps(1)} />
        </Tabs>
      </Box>
      {children}
    </Box>
  );
};

export default SystemTabs;
