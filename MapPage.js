import React, { useState, useEffect } from "react";
import MapView, { Marker, UrlTile, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";
import {
  MapHeader,
  HeaderLogo,
  HeaderMenu,
  MapBtnContainer,
  MapBtnArea,
  BtnText,
} from "../components/styles";

const MapPage = ({ navigation }) => {
  const [connectingText, setConnectingText] = useState("Connecting...");
  const [connectionError, setConnectionError] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 34.0791579,
    longitude: 73.2268463,
    latitudeDelta: 0.065,
    longitudeDelta: 0.065,
  });

  useEffect(() => {
    const fetchLocationFromAPI = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const rescueId = await AsyncStorage.getItem("rescueId");
        if (!userId || !rescueId) {
          Alert.alert("User ID not found", "Please log in again.");
          navigation.navigate("Home");
          return;
        }

        const response = await api.get(
          `/location?user_id=${userId}&rescue_id=${rescueId}`
        );
        if (
          response.status === 200 &&
          response.data &&
          response.data.latitude &&
          response.data.longitude
        ) {
          const { latitude, longitude } = response.data;
          setMapRegion({
            ...mapRegion,
            latitude,
            longitude,
          });
        } else {
          console.error("Error fetching location from API:", response);
          Alert.alert("Error", "Unable to fetch location from API.");
        }
      } catch (error) {
        console.error("Error fetching location from API:", error);
        Alert.alert(
          "Error",
          "Unable to fetch location. Please try again later."
        );
      }
    };

    fetchLocationFromAPI();

    const interval = setInterval(async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const helpId = await AsyncStorage.getItem("rescueId");

        if (!userId || !helpId) {
          Alert.alert("User ID or Rescue ID not found", "Please log in again.");
          navigation.navigate("Home");
          return;
        }

        const response = await api.get(
          `/rescuehand-status?user_id=${userId}&rescue_id=${helpId}`
        );

        if (response.status === 200 && response.data.status === "process") {
          setConnectingText("Rescue in progress");
          // Navigate to Complete page immediately
          navigation.navigate("Complete");
          console.log("navigate to complete page");
          clearInterval(interval); // Stop the interval once rescue is in progress
        } else {
          // Update connectingText to show connecting animation
          setConnectingText((prevText) =>
            prevText === "Connecting..." ? "Connecting" : prevText + "."
          );
        }
      } catch (error) {
        console.error("Error checking rescue hand status:", error);
        Alert.alert("Error", "Unable to check status. Please try again later.");
        navigation.navigate("Home");
        clearInterval(interval); // Stop the interval on error
      }
    }, 1500); // Poll every 1.5 seconds

    // Wait for 3 minutes to check for connection and handle timeout
    const timeout = setTimeout(() => {
      setConnectionError(true);
    }, 180000); // 180000 ms = 3 minutes

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (connectionError) {
      // Display alert when no users are found
      Alert.alert("No users found", "Please try again later.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    }
  }, [connectionError]);

  return (
    <View style={styles.container}>
      <MapHeader>
        <HeaderLogo
          resizeMode="cover"
          source={require(`../assets/img/logo.png`)}
        />
        <HeaderMenu>
          <Ionicons
            name="arrow-back-sharp"
            size={40}
            onPress={() => navigation.navigate("HelpRequest")}
          />
        </HeaderMenu>
      </MapHeader>
      <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={mapRegion}>
        <UrlTile
          urlTemplate="https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=n1SKgH0pXYv3DvsITk3s"
          maximumZ={19}
          flipY={false}
        />
        <Marker coordinate={mapRegion} title="Marker">
          <Ionicons name="location-outline" size={35} color="black" />
        </Marker>
      </MapView>
      <MapBtnContainer>
        <MapBtnArea>
          <BtnText>{connectingText}</BtnText>
        </MapBtnArea>
      </MapBtnContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
export default MapPage;
