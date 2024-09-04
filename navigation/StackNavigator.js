import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import LoginScreen from "../screens/LoginScreen";
// import RegisterScreen from "../screens/RegisterScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Content from "../screen/Content";
import Records from "../screen/Records";
import Discover from "../screen/Discover";
import Profile from "../screen/Profile";



import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoginScreen from "../screen/Login";
import SignUpScreen from "../screen/SignUp";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function BottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: "#DAEBFF" }, 
          tabBarLabelStyle: { color: "#008E97" },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Records"
          component={Records}
          options={{
            tabBarLabel: "Records",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Icon name="home" size={30} color="#4776D3" />
              ) : (
                <Icon name="home" size={30} color="gray" />
              ),

          }}
        />

        
        <Tab.Screen
          name="Discover"
          component={Discover}
          options={{
            tabBarLabel: "Discover",
            tabBarLabelStyle: { color: "#000" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="book" size={30} color="#4776D3" />
              ) : (
                <Ionicons name="book-outline" size={30} color="gray" />
              ),
          }}
        />

        <Tab.Screen
          name="Content"
          component={Content}
          options={{
            tabBarLabel: "Content",
            tabBarLabelStyle: { color: "#000"},
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="text-document" size={30} color="#4776D3" />
              ) : (
                <Entypo name="text-document" size={30} color="gray" />
              ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: "PROFILE",
            tabBarLabelStyle: { color: "#000" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Icon name="person" size={30} color="#4776D3" />
              ) : (
                <Icon name="person-outline" size={30} color="gray" />

              ),
          }}
        />


      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Records"
          component={Records}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
