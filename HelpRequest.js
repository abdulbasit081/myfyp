// import React, { useState, useEffect } from "react";
// import { View, Text, Alert } from "react-native";
// import KeyboardAvoiding from "../components/KeyboardAvoiding";
// import {
//   RequestStyledContainer,
//   HeaderContainer,
//   HeaderLogo,
//   HeaderMenu,
//   RequestInnerContainer,
//   FormArea,
//   InputLabel,
//   RequestTextInput,
//   RequestBtn,
//   BtnText,
// } from "../components/styles";
// import { Ionicons } from "@expo/vector-icons";
// import { Formik } from "formik";
// import * as Location from "expo-location";
// import api from "../api";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const HelpRequest = ({ navigation }) => {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const loc = await getLocation();
//       if (loc) {
//         console.log("Location fetched in useEffect:", loc);
//       }
//     })();
//   }, []);

//   // const handleLogin = async (values) => {
//   //   console.log("Form values:", values);
//   //   const loc = await getLocation();
//   //   console.log("Location fetched in handleLogin:", loc);
//   //   if (loc) {
//   //     navigation.navigate("MapPage");
//   //   } else {
//   //     setErrorMsg("Error: Unable to fetch location. Please try again later.");
//   //   }
//   // };
//   const handleLogin = async (values) => {
//     console.log("Form values:", values);
//     try {
//       const userId = await AsyncStorage.getItem("userId"); // Fetch user ID from storage
//       if (!userId) {
//         throw new Error("User ID not found in storage");
//       }

//       if (location) {
//         const data = {
//           problem: values.problem,
//           description: values.description,
//         };

//         const response = await api.post(`/rescuehand?user_id=${userId}`, data);
//         if (response.status === 200) {
//           await AsyncStorage.setItem("rescueId", response.data.id.toString());
//           navigation.navigate("MapPage");
//         } else {
//           throw new Error("Error sending help request");
//         }
//       } else {
//         setErrorMsg("Error: Unable to fetch location. Please try again later.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setErrorMsg(error.message);
//     }
//   };

//   const getLocation = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission Denied", "Location permission was denied.");
//       return null;
//     }

//     try {
//       let location = await Location.getCurrentPositionAsync({});
//       setLocation(location);
//       const { latitude, longitude } = location.coords;
//       console.log("Latitude:", latitude, "Longitude:", longitude);
//       return location;
//     } catch (error) {
//       console.error("Error fetching location:", error);
//       setErrorMsg("Error fetching location. Please try again later.");
//       return null;
//     }
//   };

//   return (
//     <KeyboardAvoiding>
//       <RequestStyledContainer>
//         <HeaderContainer>
//           <HeaderLogo
//             resizeMode="cover"
//             source={require(`../assets/img/logo.png`)}
//           />
//           <HeaderMenu>
//             <Ionicons
//               name="arrow-back-sharp"
//               size={40}
//               onPress={() => navigation.navigate("Home")}
//             />
//           </HeaderMenu>
//         </HeaderContainer>
//         <RequestInnerContainer>
//           <Formik
//             initialValues={{
//               problem: "",
//               description: "",
//             }}
//             onSubmit={handleLogin}
//           >
//             {({ handleChange, handleBlur, handleSubmit, values, touched }) => (
//               <FormArea>
//                 <MyTextInput
//                   label="Problem"
//                   placeholder="Problem"
//                   onChangeText={handleChange("problem")}
//                   onBlur={handleBlur("problem")}
//                   value={values.problem}
//                   touched={touched.problem}
//                 />
//                 <MyTextInput
//                   label="Description"
//                   placeholder="Description"
//                   onChangeText={handleChange("description")}
//                   onBlur={handleBlur("description")}
//                   value={values.description}
//                   touched={touched.description}
//                   multiline // Enable multiline input
//                   style={{ height: 160, textAlignVertical: "top" }}
//                 />
//                 <RequestBtn onPress={handleSubmit}>
//                   <BtnText>Connect</BtnText>
//                 </RequestBtn>
//               </FormArea>
//             )}
//           </Formik>
//           {errorMsg && <Text>{errorMsg}</Text>}
//         </RequestInnerContainer>
//       </RequestStyledContainer>
//     </KeyboardAvoiding>
//   );
// };

// const MyTextInput = ({ label, ...props }) => {
//   return (
//     <View>
//       <InputLabel>{label}</InputLabel>
//       <RequestTextInput {...props} />
//     </View>
//   );
// };

// export default HelpRequest;
// // new

// import React, { useState, useEffect } from "react";
// import { View, Text, Alert, ActivityIndicator } from "react-native";
// import KeyboardAvoiding from "../components/KeyboardAvoiding";
// import {
//   RequestStyledContainer,
//   HeaderContainer,
//   HeaderLogo,
//   HeaderMenu,
//   RequestInnerContainer,
//   FormArea,
//   InputLabel,
//   RequestTextInput,
//   RequestBtn,
//   BtnText,
// } from "../components/styles";
// import { Ionicons } from "@expo/vector-icons";
// import { Formik } from "formik";
// import api from "../api";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Location from "expo-location";

// const HelpRequest = ({ navigation }) => {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);
//   const [loadingLocation, setLoadingLocation] = useState(false);

//   useEffect(() => {
//     (async () => {
//       await getLocation();
//     })();
//   }, []);

//   const handleLogin = async (values) => {
//     console.log("Form values:", values);
//     try {
//       const userId = await AsyncStorage.getItem("userId"); // Fetch user ID from storage
//       if (!userId) {
//         throw new Error("User ID not found in storage");
//       }

//       if (location) {
//         const data = {
//           problem: values.problem,
//           description: values.description,
//         };

//         const response = await api.post(`/rescuehand?user_id=${userId}`, data);
//         if (response.status === 200) {
//           await AsyncStorage.setItem("rescueId", response.data.id.toString());
//           navigation.navigate("MapPage");
//         } else {
//           throw new Error("Error sending help request");
//         }
//       } else {
//         setErrorMsg("Error: Unable to fetch location. Please try again later.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setErrorMsg(error.message);
//     }
//   };

//   const getLocation = async () => {
//     try {
//       setLoadingLocation(true);
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Location permission denied");
//         Alert.alert("Permission Denied", "Location permission was denied.");
//         setErrorMsg("Location permission was denied.");
//         return;
//       }

//       // // Set a static location for the emulator
//       // const staticLocation = {
//       //   coords: {
//       //     latitude: 34.075973,
//       //     longitude: 73.255782,
//       //   },
//       // };
//       // setLocation(staticLocation);
//       // const { latitude, longitude } = staticLocation.coords;
//       // console.log("Latitude:", latitude, "Longitude:", longitude);

//       // Send location to another API
//       await sendLocationToApi(latitude, longitude);
//     } catch (error) {
//       console.error("Error fetching location:", error);
//       setErrorMsg("Error fetching location. Please try again later.");
//     } finally {
//       setLoadingLocation(false);
//     }
//   };

//   const sendLocationToApi = async (latitude, longitude) => {
//     try {
//       const userId = await AsyncStorage.getItem("userId");
//       if (!userId) {
//         throw new Error("User ID not found in storage");
//       }

//       const locationData = {
//         latitude,
//         longitude,
//       };

//       const response = await api.post(
//         `/location?user_id=${userId}`,
//         locationData
//       );
//       if (response.status !== 200) {
//         throw new Error("Error sending location");
//       }
//     } catch (error) {
//       console.error("Error sending location:", error);
//       setErrorMsg("Error sending location. Please try again later.");
//     }
//   };

//   return (
//     <KeyboardAvoiding>
//       <RequestStyledContainer>
//         <HeaderContainer>
//           <HeaderLogo
//             resizeMode="cover"
//             source={require(`../assets/img/logo.png`)}
//           />
//           <HeaderMenu>
//             <Ionicons
//               name="arrow-back-sharp"
//               size={45}
//               onPress={() => navigation.navigate("Home")}
//             />
//           </HeaderMenu>
//         </HeaderContainer>
//         <RequestInnerContainer>
//           <Formik
//             initialValues={{
//               problem: "",
//               description: "",
//             }}
//             onSubmit={handleLogin}
//           >
//             {({ handleChange, handleBlur, handleSubmit, values, touched }) => (
//               <FormArea>
//                 <MyTextInput
//                   label="Problem"
//                   placeholder="Problem"
//                   onChangeText={handleChange("problem")}
//                   onBlur={handleBlur("problem")}
//                   value={values.problem}
//                   touched={touched.problem}
//                 />
//                 <MyTextInput
//                   label="Description"
//                   placeholder="Description"
//                   onChangeText={handleChange("description")}
//                   onBlur={handleBlur("description")}
//                   value={values.description}
//                   touched={touched.description}
//                   multiline // Enable multiline input
//                   style={{ height: 160, textAlignVertical: "top" }}
//                 />
//                 <RequestBtn
//                   onPress={handleSubmit}
//                   disabled={!location || loadingLocation}
//                 >
//                   {loadingLocation ? (
//                     <ActivityIndicator color="#ffffff" />
//                   ) : (
//                     <BtnText>Connect</BtnText>
//                   )}
//                 </RequestBtn>
//               </FormArea>
//             )}
//           </Formik>
//           {errorMsg && <Text>{errorMsg}</Text>}
//         </RequestInnerContainer>
//       </RequestStyledContainer>
//     </KeyboardAvoiding>
//   );
// };

// const MyTextInput = ({ label, ...props }) => {
//   return (
//     <View>
//       <InputLabel>{label}</InputLabel>
//       <RequestTextInput {...props} />
//     </View>
//   );
// };

// export default HelpRequest;
//=========

import React, { useState, useEffect } from "react";
import { View, Text, Alert, ActivityIndicator } from "react-native";
import KeyboardAvoiding from "../components/KeyboardAvoiding";
import {
  RequestStyledContainer,
  HeaderContainer,
  HeaderLogo,
  HeaderMenu,
  RequestInnerContainer,
  FormArea,
  InputLabel,
  RequestTextInput,
  RequestBtn,
  BtnText,
} from "../components/styles";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const HelpRequest = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    (async () => {
      await getLocation();
    })();
  }, []);

  const handleLogin = async (values) => {
    console.log("Form values:", values);
    try {
      const userId = await AsyncStorage.getItem("userId"); // Fetch user ID from storage
      if (!userId) {
        throw new Error("User ID not found in storage");
      }

      if (location) {
        const data = {
          need: values.need,
          description: values.description,
          // latitude: location.coords.latitude, // Include latitude
          // longitude: location.coords.longitude, // Include longitude
        };

        const response = await api.post(`/rescuehand?user_id=${userId}`, data);
        if (response.status === 200) {
          await AsyncStorage.setItem("rescueId", response.data.id.toString());
          navigation.navigate("MapPage");
        } else {
          throw new Error("Error sending help request");
        }
      } else {
        setErrorMsg("Error: Unable to fetch location. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg(error.message);
    }
  };

  const getLocation = async () => {
    try {
      setLoadingLocation(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        Alert.alert("Permission Denied", "Location permission was denied.");
        setErrorMsg("Location permission was denied.");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      const { latitude, longitude } = location.coords;
      console.log("Latitude:", latitude, "Longitude:", longitude);

      // Send location to another API
      await sendLocationToApi(latitude, longitude);
    } catch (error) {
      console.error("Error fetching location:", error);
      setErrorMsg("Error fetching location. Please try again later.");
    } finally {
      setLoadingLocation(false);
    }
  };

  const sendLocationToApi = async (latitude, longitude) => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in storage");
      }

      const locationData = {
        latitude,
        longitude,
      };

      const response = await api.post(
        `/location?user_id=${userId}`,
        locationData
      );
      if (response.status !== 200) {
        throw new Error("Error sending location");
      }
    } catch (error) {
      console.error("Error sending location:", error);
      setErrorMsg("Error sending location. Please try again later.");
    }
  };

  return (
    <KeyboardAvoiding>
      <RequestStyledContainer>
        <HeaderContainer>
          <HeaderLogo
            resizeMode="cover"
            source={require(`../assets/img/logo.png`)}
          />
          <HeaderMenu>
            <Ionicons
              name="arrow-back-sharp"
              size={45}
              onPress={() => navigation.navigate("Home")}
            />
          </HeaderMenu>
        </HeaderContainer>
        <RequestInnerContainer>
          <Formik
            initialValues={{
              need: "",
              description: "",
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
                />
                <MyTextInput
                  label="Description"
                  placeholder="Description"
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                  value={values.description}
                  touched={touched.description}
                  multiline // Enable multiline input
                  style={{ height: 160, textAlignVertical: "top" }}
                />
                <RequestBtn
                  onPress={handleSubmit}
                  disabled={!location || loadingLocation}
                >
                  {loadingLocation ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <BtnText>Connect</BtnText>
                  )}
                </RequestBtn>
              </FormArea>
            )}
          </Formik>
          {errorMsg && <Text>{errorMsg}</Text>}
        </RequestInnerContainer>
      </RequestStyledContainer>
    </KeyboardAvoiding>
  );
};

const MyTextInput = ({ label, ...props }) => {
  return (
    <View>
      <InputLabel>{label}</InputLabel>
      <RequestTextInput {...props} />
    </View>
  );
};

export default HelpRequest;
