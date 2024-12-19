import { View, Text, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyledContainer,
  ForgotInnerContainer,
  PageTitle,
  FormArea,
  StyledTextInput,
  InputLabel,
  HideIcon,
  LoginBtn,
  BtnText,
} from "../components/styles";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import KeyboardAvoiding from "../components/KeyboardAvoiding";
import * as Yup from "yup";
import axios from "axios";
import api from "../api";

const Forgot = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const handleForgotPassword = async (values, { setSubmitting }) => {
    console.log(values);

    try {
      const response = await api.post(
        `/forget-password?user_name=${values.username}&new_password=${values.password}&confirm_password=${values.confirm_password}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      if (response.data.message) {
        Alert.alert(response.data.message);
        navigation.navigate("Login");
      } else {
        throw new Error("Failed to reset password");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert("Validation Error", "Invalid username");
      } else if (error.response && error.response.status === 404) {
        Alert.alert("Validation Error", "Password not match");
      } else {
        Alert.alert("Failed to reset password");
      }
      console.error("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoiding>
      <StyledContainer>
        <StatusBar style="dark" />
        <ForgotInnerContainer>
          <PageTitle>Forgot Password</PageTitle>

          <Formik
            initialValues={{ username: "", password: "", confirm_password: "" }}
            onSubmit={handleForgotPassword}
            validationSchema={Yup.object().shape({
              username: Yup.string().required("Username is required"),
              password: Yup.string()
                .min(8, "Password must be 8 characters")
                .required("Password is required")
                .matches(/^(?=.*\d)/, "Password must contain a number"),
              confirm_password: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm Password is required"),
            })}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <FormArea>
                <MyTextInput
                  label="Username"
                  placeholder="Username"
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                  error={touched.username && errors.username}
                  errorText={errors.username}
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
                  errorText={errors.password}
                />
                <MyTextInput
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  onChangeText={handleChange("confirm_password")}
                  onBlur={handleBlur("confirm_password")}
                  value={values.confirm_password}
                  secureTextEntry={hideConfirmPassword}
                  isPassword={true}
                  hidePassword={hideConfirmPassword}
                  setHidePassword={setHideConfirmPassword}
                  error={touched.confirm_password && errors.confirm_password}
                  errorText={errors.confirm_password}
                />
                <LoginBtn onPress={handleSubmit} disabled={isSubmitting}>
                  <BtnText>Save Password</BtnText>
                </LoginBtn>
              </FormArea>
            )}
          </Formik>
        </ForgotInnerContainer>
      </StyledContainer>
    </KeyboardAvoiding>
  );
};

const MyTextInput = ({
  label,
  icon,
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

export default Forgot;
