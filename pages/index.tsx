import React, { useState, useEffect } from "react";
import {
  SystemAppbar,
  SystemCard,
  SystemContainer,
  SystemTabs,
  SystemStepper,
} from "../components";
import { CardContent, Typography, Box, Stack, Grid } from "@mui/material";
import { ControlledTextField } from "../components/TextField/TextField";
import { ControlledCheckbox } from "../components/Checkbox/Checkbox";
import { ControlledSelectField, SelectOption } from "../components/SelectField";
import { ControlledMobileNumberField } from "../components/TextField/MobileNumberField";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "../utils/form-schema";
import { usePreviousValue } from "../utils/hooks/previousValue";
import NextPreviousButton from "../components/Button/NextPreviousButton";
import { PrimaryButton } from "../components/Button/PrimaryButton";
import { BSBAPI, gitlabProvinces } from "./api/http";
import Systembackdrop from "../components/Backdrop/Backdrop";
import Login from "./Login";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, index, value } = props;

  return (
    <div
      role={"tabpanel"}
      hidden={value !== index}
      id={`simple-tabpane-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const baseSchema = z.object({
  firstName: requiredString("Your firstname is required."),
  lastName: requiredString("Your lastname is required."),
  middleName: requiredString("Your middlename is required."),
  province: requiredString("Your province is required"),
  cities: requiredString("Your city is required"),
  zipcode: requiredString("Your zip code is required"),
  address: requiredString("Your address is required"),
  accountType: requiredString("Please select your account type."),
  amount: requiredString("Please provide deposit amount"),
  mobile_number: requiredString("Please provide your mobile number"),
  email: requiredString("Your email is required.").email(),
  password: requiredString("Your password is required."),
  conpassword: requiredString("Please confirm your password"),
});
const schema = z
  .discriminatedUnion("hasNoMiddleName", [
    z
      .object({
        hasNoMiddleName: z.literal(false),
        middleName: requiredString(
          "Please provide your middle name or select `I do not have a middle name`."
        ),
      })
      .merge(baseSchema),
    z
      .object({
        hasNoMiddleName: z.literal(true),
      })
      .merge(baseSchema),
  ])
  .refine(
    ({ conpassword, password }) => {
      return password === conpassword;
    },
    { path: ["conpassword"], message: "Password did not match" }
  );

export type openAccountFormData = z.infer<typeof schema>;

type Props = {
  onSubmit?: (values: openAccountFormData) => void;
};
const Home: React.FC<Props> = ({ onSubmit }) => {
  const [value, setValue] = useState(0);
  const [activeSteps, setActiveSteps] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const [depositType, setDepositType] = useState([
    {
      name: "Savings Account",
      label: "Savings Account",
      value: "savings_account",
      regionCode: "",
    },
    {
      name: "Expenses Account",
      label: "Expenses Account",
      value: "expenses_account",
      regionCode: "",
    },
  ]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const {
    getValues,
    register,
    control,
    handleSubmit: handleHookSubmit,
    resetField,
    formState: { isValid },
    watch,
    trigger,
  } = useForm<openAccountFormData>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      province: "",
      cities: "",
      zipcode: "",
      address: "",
      accountType: "",
      amount: "",
      mobile_number: "",
      email: "",
      password: "",
      conpassword: "",
      hasNoMiddleName: false,
    },
  });
  const handleSubmit = () => {
    const values = getValues();
    const obj = {
      firstname : values.firstName,
      lastname : values.lastName,
      middlename : values.middleName,
      province: values.province,
      city: values.cities,
      zipcode: values.zipcode,
      address : values.address,
      account_type: values.accountType,
      deposit_amount: values.amount,
      mobile_number: values.mobile_number,
      email: values.email,
      password: values.password
    }
    setOpen(!open);
    const request = BSBAPI.post(`/api/Client/open-account`, obj)
    request.then((res : any) => {
      console.log(res)
    })
  };
  const hasNoMiddleName = watch("hasNoMiddleName");
  const hasNoMiddleNamePrevValue = usePreviousValue(hasNoMiddleName);
  const watchProvince = watch("province");
  const data = getValues();
  useEffect(() => {
    resetField("middleName");
    if (hasNoMiddleNamePrevValue) {
      trigger("middleName");
    }
  }, [hasNoMiddleName, hasNoMiddleNamePrevValue, resetField, trigger]);

  useEffect(() => {
    const response = gitlabProvinces.get("/api/island-groups/luzon/provinces/");
    response.then((res: any) => {
      const { data }: any = res;
      setProvinces(data);
    });
    const filterProvinceByName = provinces.filter(
      (item: any) => item.name == data.province
    );
    filterProvinceByName.map((u: any) => {
      const filterCitiesByProvince = gitlabProvinces.get(
        `/api/regions/${u.regionCode}/cities/`
      );
      filterCitiesByProvince.then((r: any) => {
        setCities(r.data);
      });
    });
  }, [watchProvince]);

  return (
    <>
      <SystemAppbar />
      <SystemContainer maxWidth={"lg"}>
        <SystemCard
          style={{
            marginTop: "100px",
          }}
          children={
            <CardContent>
              <SystemTabs
                value={value}
                handleChange={handleChange}
                children={
                  <>
                    <TabPanel value={value} index={0}>
                      <Login />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <>
                        <Stack pb={3} gap={1} width={[, 600]} mx="auto">
                          <Stack
                            gap={1}
                            alignItems="center"
                            textAlign="center"
                            my={2}
                          >
                            <Typography
                              color="secondary"
                              fontWeight="bold"
                              textAlign="center"
                            >
                              Personal Information
                            </Typography>
                            <Typography
                              textAlign="center"
                              fontSize="0.9rem"
                              maxWidth="90%"
                            >
                              Provide details about yourself to help us identify
                              you.
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
                              name="firstName"
                              required
                              label="Firstname"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <ControlledTextField
                              control={control}
                              disabled={hasNoMiddleName}
                              name="middleName"
                              required={!hasNoMiddleName}
                              label="Middlename"
                            />
                            <ControlledCheckbox
                              control={control}
                              name="hasNoMiddleName"
                              label="I do not have a middle name"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <ControlledTextField
                              control={control}
                              name="lastName"
                              required
                              label="Lastname"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <ControlledMobileNumberField
                              control={control}
                              name="mobile_number"
                              required
                              label="Mobile Number"
                            />
                          </Grid>
                        </Grid>
                        <hr />
                        <Stack pb={3} gap={1} width={[, 600]} mx="auto">
                          <Stack
                            gap={1}
                            alignItems="center"
                            textAlign="center"
                            my={2}
                          >
                            <Typography
                              color="secondary"
                              fontWeight="bold"
                              textAlign="center"
                            >
                              Hometown Information
                            </Typography>
                            <Typography
                              textAlign="center"
                              fontSize="0.9rem"
                              maxWidth="90%"
                            >
                              Provide details about your address to help us
                              identify you.
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
                            <ControlledSelectField
                              control={control}
                              name="province"
                              options={provinces}
                              label="Province"
                              required
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <ControlledSelectField
                              control={control}
                              name="cities"
                              options={cities}
                              label="City"
                              required
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <ControlledTextField
                              control={control}
                              name="zipcode"
                              required
                              label="Zipcode"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <ControlledTextField
                              control={control}
                              name="address"
                              required
                              label="Address"
                              multiline={true}
                              id={"outlined-multiline-static"}
                              rows={4}
                            />
                          </Grid>
                        </Grid>
                        <Stack pb={3} gap={1} width={[, 600]} mx="auto">
                          <Stack
                            gap={1}
                            alignItems="center"
                            textAlign="center"
                            my={2}
                          >
                            <Typography
                              color="secondary"
                              fontWeight="bold"
                              textAlign="center"
                            >
                              Onhand Savings Deposit
                            </Typography>
                            <Typography
                              textAlign="center"
                              fontSize="0.9rem"
                              maxWidth="90%"
                            >
                              Provide deposit amount for your onhand savings.
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
                            <ControlledSelectField
                              control={control}
                              name="accountType"
                              options={depositType}
                              label="Account Type"
                              required
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <ControlledTextField
                              control={control}
                              name="amount"
                              required
                              label="Deposit Amount"
                            />
                          </Grid>
                        </Grid>
                        <Stack pb={3} gap={1} width={[, 600]} mx="auto">
                          <Stack
                            gap={1}
                            alignItems="center"
                            textAlign="center"
                            my={2}
                          >
                            <Typography
                              color="secondary"
                              fontWeight="bold"
                              textAlign="center"
                            >
                              Credentials
                            </Typography>
                            <Typography
                              textAlign="center"
                              fontSize="0.9rem"
                              maxWidth="90%"
                            >
                              Provide your credentials.
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
                              label="New Password"
                              type="password"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <ControlledTextField
                              control={control}
                              name="conpassword"
                              required
                              label="Confirm Password"
                              type="password"
                            />
                          </Grid>
                        </Grid>
                        <PrimaryButton
                          style={{
                            float: "right",
                            marginTop: "10px",
                            marginBottom: "10px",
                          }}
                          onClick={handleSubmit}
                          disabled={!isValid}
                        >
                          Submit
                        </PrimaryButton>
                      </>
                      <Systembackdrop open={open} />
                    </TabPanel>
                  </>
                }
              />
            </CardContent>
          }
        />
      </SystemContainer>
    </>
  );
};

export default Home;
