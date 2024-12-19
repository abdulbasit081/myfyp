import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  StyledHomeContainer,
  HeaderContainer,
  HeaderLogo,
  HeaderMenu,
  WeightContainer,
  WeightArea,
  WeightItems,
  WeightText,
  BtnContainer,
  BtnArea,
  BtnText,
} from "../components/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";
import { Color } from "../components/styles"; // import color

const { primary } = Color;

const Home = ({ navigation }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [completedHelp, setCompletedHelp] = useState(0);
  const [helpRequests, setHelpRequests] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users
        const totalUsersResponse = await api.get("/total-users", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setTotalUsers(totalUsersResponse.data.total_users);

        // Fetch active users
        const activeUsersResponse = await api.get("/active-users", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setActiveUsers(activeUsersResponse.data.active_users);

        // Fetch completed help
        const completedHelpResponse = await api.get("/completed-help", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setCompletedHelp(completedHelpResponse.data.completed_help);

        // Fetch help requests
        const helpRequestsResponse = await api.get("/current-help-requests", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setHelpRequests(helpRequestsResponse.data.current_help_requests);
      } catch (error) {
        console.error("Failed to fetch statistics", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <StyledHomeContainer>
      <HeaderContainer>
        <HeaderLogo
          resizeMode="cover"
          source={require(`../assets/img/logo.png`)}
        />
        <HeaderMenu>
          <MaterialIcons
            name="menu-open"
            size={45}
            onPress={() => navigation.navigate("Menu")}
          />
        </HeaderMenu>
      </HeaderContainer>
      <WeightContainer>
        <WeightArea>
          <WeightItems>
            <FontAwesome5 name="user-friends" size={45} color={primary} />
            <WeightText>Users</WeightText>
            <WeightText>{totalUsers}</WeightText>
          </WeightItems>
        </WeightArea>
        <WeightArea>
          <WeightItems>
            <AntDesign name="mobile1" size={45} color={primary} />
            <WeightText>Active Users</WeightText>
            <WeightText>{activeUsers}</WeightText>
          </WeightItems>
        </WeightArea>

        <WeightArea>
          <WeightItems>
            <FontAwesome5 name="people-arrows" size={45} color={primary} />
            <WeightText>Help Request</WeightText>
            <WeightText>{helpRequests}</WeightText>
          </WeightItems>
        </WeightArea>
        <WeightArea>
          <WeightItems>
            <FontAwesome5 name="hands-helping" size={45} color={primary} />
            <WeightText>Helped</WeightText>
            <WeightText>{completedHelp}</WeightText>
          </WeightItems>
        </WeightArea>
      </WeightContainer>
      <BtnContainer>
        <BtnArea onPress={() => navigation.navigate("HelpRequest")}>
          <BtnText>Call For Help</BtnText>
        </BtnArea>
      </BtnContainer>
    </StyledHomeContainer>
  );
};

export default Home;
