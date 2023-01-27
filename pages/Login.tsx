import React, { useState, useEffect } from "react";
import { CardContent, Typography, Box, Stack, Grid } from "@mui/material";
import { ControlledTextField } from "../components/TextField/TextField";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton } from "../components/Button/PrimaryButton";
import Systembackdrop from "../components/Backdrop/Backdrop";
import { buildRequest } from "./api/http";
import { SystemCard } from "../components";
import { requiredString } from "../utils/form-schema";

const baseSchema = z.object({
  email: requiredString("Your email is required.").email(),
  password: requiredString("Your password is required."),
});

type LoginAccount = z.infer<typeof baseSchema>;

const Login: React.FC = () => {
  const {
    control,
    handleSubmit: handleHookSubmit,
    formState: { isValid },
  } = useForm<LoginAccount>({
    mode: "all",
    resolver: zodResolver(baseSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <>
      <SystemCard
        children={
          <CardContent>
            <Stack pb={3} gap={1} width={[, 600]} mx="auto">
              <Stack gap={1} alignItems="center" textAlign="center" my={2}>
                <Typography
                  color="secondary"
                  fontWeight="bold"
                  textAlign="center"
                >
                  Sign in
                </Typography>
                <Typography textAlign="center" fontSize="0.9rem" maxWidth="90%">
                  Provide your credenetials to sign in.
                </Typography>
              </Stack>
            </Stack>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              style={{ marginBottom: "20px" }}
            >
              <Grid item xs={6}>
                <ControlledTextField
                  control={control}
                  name="email"
                  required
                  label="Email"
                />
              </Grid>
              <Grid item xs={6}>
                <ControlledTextField
                  control={control}
                  name="password"
                  required
                  label="Password"
                />
              </Grid>
            </Grid>
            <PrimaryButton
              style={{
                float: "right",
                marginTop: "10px",
                marginBottom: "10px",
              }}
              disabled={!isValid}
            >
              Login
            </PrimaryButton>
          </CardContent>
        }
      />
    </>
  );
};

export default Login;
