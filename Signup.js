import { Text, View, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyledContainer,
  SignUpInnerContainer,
  PageTitle,
  FormArea,
  StyledTextInput,
  InputLabel,
  HideIcon,
  LoginBtn,
  BtnText,
  ExtraText,
  TextLink,
  TextLinkContent,
  Line,
} from "../components/styles";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import { Formik } from "formik";
import KeyboardAvoiding from "../components/KeyboardAvoiding";
import * as Yup from "yup";
import api from "../api";

const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);

  const handleSignup = async (values) => {
    try {
      const response = await api.post("/register_user", values, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response.data); // Log the response data
      Alert.alert("Signup Successful");
      navigation.navigate("Login"); // Navigate to login screen after successful signup
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.detail || "Signup Failed";
      Alert.alert(errorMsg);
    }
  };

  return (
    <KeyboardAvoiding>
      <StyledContainer>
        <StatusBar style="dark" />
        <SignUpInnerContainer>
          <PageTitle>Signup</PageTitle>

          <Formik
            initialValues={{
              full_name: "",
              user_name: "",
              email: "",
              password: "",
              phone: "",
              cnic: "",
              user_location: "",
            }}
            onSubmit={handleSignup}
            // validationSchema={Yup.object().shape({
            //   full_name: Yup.string().required("Full name is required"),
            //   user_name: Yup.string().required("Username is required"),
            //   email: Yup.string()
            //     .email("Invalid email")
            //     .required("Email is required"),
            //   password: Yup.string()
            //     .min(8, "Password must be 8 characters")
            //     .required("Password is required"),
            //   phone: Yup.string().required("Phone number is required"),
            //   cnic: Yup.string()
            //     .required("CNIC number is required")
            //     .matches(/^\d{5}-\d{7}-\d{1}$/, "CNIC format XXXXX-XXXXXXX-X"),
            //   user_location: Yup.string().required("Location is required"),
            // })}
            validationSchema={Yup.object().shape({
              full_name: Yup.string().required("Full name is required"),
              user_name: Yup.string()
                .matches(/^(?=.*\d).+$/, "Username must have number")
                .required("Username is required"),
              email: Yup.string()
                .email("Invalid email")
                .required("Email is required"),
              password: Yup.string()
                .min(8, "Password must be 8 char")
                .max(10, "Password less to 10 char")
                .matches(
                  /^(?=.*\d)[a-zA-Z\d]{8,10}$/,
                  "Password include one number"
                )
                .required("Password is required"),
              phone: Yup.string()
                .matches(/^\d{11}$/, "Phone number have 11 digits")
                .required("Phone number is required"),
              cnic: Yup.string()
                .matches(/^\d{5}-\d{7}-\d{1}$/, "CNIC format XXXXX-XXXXXXX-X")
                .required("CNIC number is required"),
              user_location: Yup.string().required("Location is required"),
            })}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <FormArea>
                <MyTextInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  onChangeText={handleChange("full_name")}
                  onBlur={handleBlur("full_name")}
                  value={values.full_name}
                  error={touched.full_name && errors.full_name}
                />

                <MyTextInput
                  label="Username"
                  placeholder="Username"
                  onChangeText={handleChange("user_name")}
                  onBlur={handleBlur("user_name")}
                  value={values.user_name}
                  error={touched.user_name && errors.user_name}
                />
                <MyTextInput
                  label="Email"
                  placeholder="Email"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                  error={touched.email && errors.email}
                />
                <MyTextInput
                  label="Password"
                  placeholder="Password"
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                  error={touched.password && errors.password}
                />
                <MyTextInput
                  label="Phone"
                  placeholder="Phone Number"
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  keyboardType="number-pad"
                  error={touched.phone && errors.phone}
                />
                <MyTextInput
                  label="CNIC"
                  placeholder="CNIC Number"
                  onChangeText={handleChange("cnic")}
                  onBlur={handleBlur("cnic")}
                  value={values.cnic}
                  error={touched.cnic && errors.cnic}
                />
                <MyTextInput
                  label="Location"
                  placeholder="Enter your location"
                  onChangeText={handleChange("user_location")}
                  onBlur={handleBlur("user_location")}
                  value={values.user_location}
                  error={touched.user_location && errors.user_location}
                />

                <LoginBtn onPress={handleSubmit}>
                  <BtnText>Signup</BtnText>
                </LoginBtn>
                <ExtraText>
                  <Text>Already have an account?</Text>
                  <TextLink onPress={() => navigation.navigate("Login")}>
                    <TextLinkContent>Login</TextLinkContent>
                  </TextLink>
                </ExtraText>
              </FormArea>
            )}
          </Formik>
        </SignUpInnerContainer>
      </StyledContainer>
    </KeyboardAvoiding>
  );
};

const MyTextInput = ({
  label,
  isPassword,
  hidePassword,
  setHidePassword,
  error,
  ...props
}) => {
  return (
    <View>
      {error ? (
        <InputLabel style={{ color: "red" }}>{error}</InputLabel>
      ) : (
        <InputLabel>{label}</InputLabel>
      )}
      <StyledTextInput {...props} />
      {isPassword && (
        <HideIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? "eye-off-outline" : "eye-outline"}
            size={25}
          />
        </HideIcon>
      )}
    </View>
  );
};

export default Signup;
