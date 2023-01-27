import React from "react";
import { Card } from "@mui/material";

type Props = {
  children?: any;
  style?: React.CSSProperties;
};

const SystemCard: React.FC<Props> = ({ children, style }) => {
  return (
    <>
      <Card style={style}>{children}</Card>
    </>
  );
};

export default SystemCard;
