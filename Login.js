import React, { useState } from "react";
import { View, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
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
} from "../components/styles";
import { Ionicons } from "@expo/vector-icons";
import KeyboardAvoiding from "../components/KeyboardAvoiding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import api from "../api";

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState();
  const handleLogin = async (values) => {
    setLoading(true);
    console.log(values);
    var bodyFormData = new FormData();
    bodyFormData.append("username", values.username);
    bodyFormData.append("password", values.password);
    try {
      const response = await api.post("/token/", bodyFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);

      if (response.data.access_token) {
        await AsyncStorage.setItem("token", response.data.access_token);
        await AsyncStorage.setItem("userId", response.data.user_id.toString());
        navigation.navigate("Home");
        setLoading(false);
        setValues({ username: "", password: "" });
      } else {
        setLoading(false);
        setValues({ username: "", password: "" });
        throw new Error("Invalid username or password");
      }
    } catch (error) {
      Alert.alert("invalid username or password");
      setLoading(false);
      console.error("Error", error.message);
    }
  };

  return (
    <KeyboardAvoiding>
      <StyledContainer>
        <StatusBar style="dark" />
        <PageLogo
          resizeMode="cover"
          source={require("../assets/img/logo.png")}
        />
        <InnerContainer>
          <PageTitle>Login</PageTitle>
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, touched }) => (
              <FormArea>
                <MyTextInput
                  label="Username"
                  placeholder="Username"
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                  touched={touched.username}
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
                  touched={touched.password}
                />
                <LoginBtn onPress={handleSubmit} disabled={loading}>
                  <BtnText>Login</BtnText>
                </LoginBtn>
                <ExtraText>
                  <TextLink onPress={() => navigation.navigate("Forgot")}>
                    <TextLinkContent>Forget password?</TextLinkContent>
                  </TextLink>
                  <TextLink onPress={() => navigation.navigate("Signup")}>
                    <TextLinkContent>Signup</TextLinkContent>
                  </TextLink>
                </ExtraText>
              </FormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoiding>
  );
};

const MyTextInput = ({
  label,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  return (
    <View>
      <InputLabel>{label}</InputLabel>
      <StyledTextInput
        {...props}
        secureTextEntry={isPassword && hidePassword}
      />
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

export default Login;
