import React, { useEffect, useState } from "react";
import { Image, Alert } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode as base64decode } from "base-64"; // Import base64decode from base-64
import { useNavigation } from "@react-navigation/native";
import { AppTitle1, AppTitle2, SplashContainer } from "../components/styles";

// Set global atob to base64decode
global.atob = base64decode;

SplashScreen.preventAutoHideAsync();

const Splash = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    async function prepare() {
      try {
        console.log("Checking internet connection...");
        // Check for internet connection
        const state = await NetInfo.fetch();
        console.log("Connection state:", state);
        setIsConnected(state.isConnected);

        if (state.isConnected) {
          console.log("Internet connected, checking token...");
          // Check token expiration
          const token = await AsyncStorage.getItem("token");
          console.log("Token from AsyncStorage:", token);

          if (token) {
            try {
              const decodedToken = JSON.parse(atob(token.split(".")[1]));
              const tokenExpiration = decodedToken.exp * 1000; // Convert expiration to milliseconds
              const currentTimestamp = new Date().getTime();
              console.log("decode token ===>", decodedToken);
              console.log("token expire===>", tokenExpiration);
              console.log("current time ===>", currentTimestamp);
              if (currentTimestamp < tokenExpiration) {
                console.log("Token is valid, navigating to Home screen...");
                navigation.navigate("Connect");
                // navigation.navigate("Connectn");
              } else {
                console.log("Token has expired, navigating to Login screen...");
                navigation.navigate("Login");
              }
            } catch (error) {
              console.warn("Error decoding token:", error);
              navigation.navigate("Login"); // Navigate to Login screen if decoding fails
            }
          } else {
            console.log("No token found, navigating to Login screen...");
            navigation.navigate("Login");
          }
        } else {
          console.log("Internet not available.");
          Alert.alert(
            "No Internet Connection",
            "Please check your internet connection."
          );
        }
      } catch (e) {
        console.warn("Error during preparation:", e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        console.log("App is ready.");
        await SplashScreen.hideAsync();
        console.log("Splash screen hidden.");
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <SplashContainer>
      <Image resizeMode="cover" source={require("../assets/splash.png")} />
      <AppTitle1>Quick</AppTitle1>
      <AppTitle2>Assist</AppTitle2>
    </SplashContainer>
  );
};

export default Splash;
