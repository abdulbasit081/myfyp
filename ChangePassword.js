import { View, Text, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyledContainer,
  ForgotInnerContainer,
  ChangePasswordTitle,
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
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to get user ID from AsyncStorage
const getUserId = async () => {
  try {
    return await AsyncStorage.getItem("userId");
  } catch (error) {
    console.error("Failed to retrieve user ID", error);
    return null;
  }
};

const ChangePassword = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const handleChangePassword = async (values, { setSubmitting }) => {
    const userId = await getUserId();

    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      setSubmitting(false);
      return;
    }

    try {
      const response = await api.put(
        `/change-password?password=${values.password}&new_password=${values.new_password}&user_id=${userId}`,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.message) {
        Alert.alert(response.data.message);
        navigation.navigate("Home");
      } else {
        throw new Error("Failed to change password");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert("Validation Error", "Invalid current password");
      } else if (error.response && error.response.status === 404) {
        Alert.alert("Validation Error", "Passwords do not match");
      } else {
        Alert.alert("Failed to change password");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoiding>
      <StyledContainer>
        <StatusBar style="dark" />
        <ForgotInnerContainer>
          <ChangePasswordTitle>Change Password</ChangePasswordTitle>

          <Formik
            initialValues={{
              password: "",
              new_password: "",
              confirm_password: "",
            }}
            onSubmit={(values, { setSubmitting }) =>
              handleChangePassword(values, { setSubmitting })
            }
            validationSchema={Yup.object().shape({
              password: Yup.string().required("Password is required"),
              new_password: Yup.string()
                .min(8, "Password must be 8 characters")
                .required("New Password is required")
                .matches(/^(?=.*\d)/, "Password must contain number"),
              confirm_password: Yup.string()
                .oneOf([Yup.ref("new_password"), null], "Passwords must match")
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
            }) => (
              <FormArea>
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
                  label="New Password"
                  placeholder="New Password"
                  onChangeText={handleChange("new_password")}
                  onBlur={handleBlur("new_password")}
                  value={values.new_password}
                  secureTextEntry={hideNewPassword}
                  isPassword={true}
                  hidePassword={hideNewPassword}
                  setHidePassword={setHideNewPassword}
                  error={touched.new_password && errors.new_password}
                  errorText={errors.new_password}
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
                <LoginBtn onPress={handleSubmit}>
                  <BtnText>Save</BtnText>
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

export default ChangePassword;
