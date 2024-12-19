import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import KeyboardAvoiding from "../components/KeyboardAvoiding";
import {
  RequestStyledContainer,
  HeaderContainer,
  HeaderLogo,
  RequestInnerContainer,
  FormArea,
  InputLabel,
  RequestTextInput,
  RequestBtn,
  BtnText,
} from "../components/styles";
import { Formik } from "formik";
import * as Location from "expo-location";
import api from "../api"; // Replace with your actual API import
import AsyncStorage from "@react-native-async-storage/async-storage";

const Connect = ({ navigation }) => {
  const [withinRange, setWithinRange] = useState(false); // State to track if within range
  const [error, setErrorMsg] = useState(null); // State for error messages
  const [need, setNeed] = useState(""); // State for need description
  const [description, setDescription] = useState(""); // State for description
  const [targetLocation, setTargetLocation] = useState(null); // State for target location
  const [Locationist, setLocation] = useState(null); // State for current location

  // useEffect to fetch location and target location data on component mount
  useEffect(() => {
    getLocationAndSendToApi();
    fetchTargetLocation();
    fetchLocation();
  }, []);

  // Function to fetch current location and send it to API
  const getLocationAndSendToApi = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      if (!location) {
        setErrorMsg("Error: Unable to fetch location. Please try again later.");
        return;
      }

      const { latitude, longitude } = location.coords;
      console.log(latitude);
      console.log(longitude);
      await sendLocationToApi(latitude, longitude);
    } catch (error) {
      console.error("Error fetching or sending location:", error);
      setErrorMsg(
        "Error fetching or sending location. Please try again later."
      );
    }
  };

  // Function to send current location to API
  const sendLocationToApi = async (latitude, longitude) => {
    try {
      const help_doner_id = await AsyncStorage.getItem("userId");
      console.log(help_doner_id);
      const locationData = {
        latitude,
        longitude,
      };

      const response = await api.post(
        `/doner-location?help_doner_id=${help_doner_id}`,
        locationData
      );

      if (response.status !== 200) {
        throw new Error("Error sending location");
      }

      const { d_loc_id, h_receiver_id, id, r_loc_id, need, description } =
        response.data.message;
      if (!d_loc_id || !h_receiver_id || !id || !r_loc_id) {
        throw new Error("Invalid response from server");
      }

      setNeed(need);
      setDescription(description);

      await AsyncStorage.setItem("D_loc_id", d_loc_id.toString());
      await AsyncStorage.setItem("h_rec_id", h_receiver_id.toString());
      await AsyncStorage.setItem("rescue_id", id.toString());
      await AsyncStorage.setItem("R_loc_id", r_loc_id.toString());
    } catch (error) {
      console.error("Error sending location:", error);
      setErrorMsg("Error sending location. Please try again later.");
    }
  };

  // Function to fetch target location from API
  const fetchTargetLocation = async () => {
    try {
      const h_receiver_id = await AsyncStorage.getItem("h_rec_id");
      const rescue_id = await AsyncStorage.getItem("rescue_id");

      const response = await api.get(
        `/r-location?h_receiver_id=${h_receiver_id}&rescue_id=${rescue_id}`
      );

      if (response.data.latitude && response.data.longitude) {
        setTargetLocation({
          latitude: response.data.latitude,
          longitude: response.data.longitude,
        });
      } else {
        throw new Error("Invalid target location data received");
      }
    } catch (error) {
      console.error("Error fetching target location:", error);
      setErrorMsg("Error fetching target location. Please try again later.");
    }
  };

  // Function to fetch current location from API
  const fetchLocation = async () => {
    try {
      const h_doner_id = await AsyncStorage.getItem("userId");
      const rescue_id = await AsyncStorage.getItem("rescue_id");

      const response = await api.get(
        `/d-location?h_doner_id=${h_doner_id}&rescue_id=${rescue_id}`
      );

      if (response.data.latitude && response.data.longitude) {
        setLocation({
          latitude: response.data.latitude,
          longitude: response.data.longitude,
        });
      } else {
        throw new Error("Invalid location data received");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setErrorMsg("Error fetching location. Please try again later.");
    }
  };

  // useEffect to check distance when Locationist or targetLocation updates
  useEffect(() => {
    if (Locationist && targetLocation) {
      const distance = calculateDistance(
        Locationist.latitude,
        Locationist.longitude,
        targetLocation.latitude,
        targetLocation.longitude
      );

      // Check if distance is within 4 kilometers (4000 meters)
      if (distance <= 4) {
        setWithinRange(true);
      } else {
        setWithinRange(false);
        // Alert user and navigate to Home screen
        Alert.alert(
          "Out of Range",
          "You are more than 4 kilometers away from the target location.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Home"),
            },
          ]
        );
      }
    }
  }, [Locationist, targetLocation]);

  // Function to handle form submission
  const handleLogin = (values) => {
    console.log(values); // Log form values
    navigation.navigate("Accept"); // Navigate to Accept screen
  };

  return (
    <KeyboardAvoiding>
      <RequestStyledContainer>
        <HeaderContainer>
          <HeaderLogo
            resizeMode="cover"
            source={require(`../assets/img/logo.png`)}
          />
        </HeaderContainer>
        <RequestInnerContainer>
          <Formik
            enableReinitialize
            initialValues={{
              need: need,
              description: description,
            }}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, touched }) => (
              <FormArea>
                <MyTextInput
                  label="Need"
                  placeholder="Need"
                  onChangeText={handleChange("need")}
                  onBlur={handleBlur("need")}
                  value={values.need}
                  touched={touched.need}
                  editable={false}
                />
                <MyTextInput
                  label="Description"
                  placeholder="Description"
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                  value={values.description}
                  touched={touched.description}
                  multiline
                  style={{ height: 160, textAlignVertical: "top" }}
                  editable={false}
                />
                <RequestBtn onPress={handleSubmit} disabled={!withinRange}>
                  <BtnText>Next</BtnText>
                </RequestBtn>
              </FormArea>
            )}
          </Formik>
        </RequestInnerContainer>
      </RequestStyledContainer>
    </KeyboardAvoiding>
  );
};

// Custom TextInput component
const MyTextInput = ({ label, ...props }) => {
  return (
    <View>
      <InputLabel>{label}</InputLabel>
      <RequestTextInput {...props} />
    </View>
  );
};

// Function to calculate distance between two points given their latitude and longitude
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  console.log("distance", distance);
  return distance;
};

// Helper function to convert degrees to radians
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export default Connect;
