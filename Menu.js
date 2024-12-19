import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  HeaderContainer,
  HeaderLogo,
  HeaderMenu,
  MenuContainer,
  MenuItems,
  MenuUser,
  MenuLink,
  MenuLinkContent,
  Line,
} from "../components/styles";
import { Ionicons } from "@expo/vector-icons";
import api from "../api";

const Menu = ({ navigation }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const response = await api.get(`/user_name?&user_id=${userId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setUserName(response.data.username); // Adjust this based on your API response structure
      } catch (error) {
        console.error("Failed to retrieve user name", error);
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      // Navigate to Login screen
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error clearing app data.", error);
    }
  };

  return (
    <MenuContainer>
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
      <MenuUser>{userName}</MenuUser>
      <MenuItems>
        <MenuLink onPress={() => navigation.navigate("ChangePassword")}>
          <MenuLinkContent>Change Password</MenuLinkContent>
        </MenuLink>
        <Line />
        <MenuLink onPress={() => navigation.navigate("DeleteAccount")}>
          <MenuLinkContent>Delete Account</MenuLinkContent>
        </MenuLink>
        <Line />
        <TouchableOpacity onPress={handleLogout}>
          <MenuLinkContent>Logout</MenuLinkContent>
        </TouchableOpacity>
        <Line />
      </MenuItems>
    </MenuContainer>
  );
};

export default Menu;
