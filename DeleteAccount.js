import { View, Text, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyledContainer,
  DeleteInnerContainer,
  PageTitle,
  FormArea,
  StyledTextInput,
  InputLabel,
  HideIcon,
  LoginBtn,
  BtnText,
  Color,
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

const handleDeleteAccount = async (values, { setSubmitting, navigation }) => {
  const userId = await getUserId();

  if (!userId) {
    Alert.alert("Error", "User not authenticated");
    setSubmitting(false);
    return;
  }

  try {
    const response = await api.delete(
      `/delete-account?user_name=${values.username}&password=${values.password}&user_id=${userId}`,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.message) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      Alert.alert(response.data.message);
      navigation.navigate("Login");
    } else {
      throw new Error("Failed to delete account");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      Alert.alert("Validation Error", "Invalid username or password");
    } else {
      Alert.alert("Failed to delete account");
    }
  } finally {
    setSubmitting(false);
  }
};

const DeleteAccount = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <KeyboardAvoiding>
      <StyledContainer>
        <StatusBar style="dark" />
        <DeleteInnerContainer>
          <PageTitle>Delete Account</PageTitle>

          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={(values, { setSubmitting }) =>
              handleDeleteAccount(values, { setSubmitting, navigation })
            }
            validationSchema={Yup.object().shape({
              username: Yup.string().required("Username is required"),
              password: Yup.string().required("Password is required"),
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
                  label="Username"
                  placeholder="Username"
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                  error={touched.username && errors.username}
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
                <LoginBtn onPress={handleSubmit}>
                  <BtnText>Confirm</BtnText>
                </LoginBtn>
              </FormArea>
            )}
          </Formik>
        </DeleteInnerContainer>
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

export default DeleteAccount;
