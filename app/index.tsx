import React from 'react';
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '@/components/HomeScreen.js';
import Map from '@/components/Map.js';
import Journal from '@/components/Journal.js';
import Settings from '@/components/Settings.js';
import Food from '@/components/Food.js'
import { Ionicons } from '@expo/vector-icons';
import FoodNavigator from "@/components/navigation/FoodNavigator.js";

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function MyTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name = "Bites" component = {HomeScreen} options={
        {headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 30,
            textAlign: 'center'
          },
        tabBarIcon: () => (
          <Ionicons name="home" color={"black"} size={24} />
        )
      }}/>

      <Tab.Screen name = "Map" component = {Map} options={
        {
          tabBarIcon: () => (
            <Ionicons name="map" color={"black"} size={24} />
          )
      }}/>

      <Tab.Screen name = "FoodNavigator" component = {FoodNavigator} options={{
          tabBarIcon: () => (
            <Ionicons name="book" color={"black"} size={24} />
          ),
          tabBarLabel: 'Journal',
          headerShown: false
      }}/>

      <Tab.Screen name = "Settings" component = {Settings} options={{
          tabBarIcon: () => (
            <Ionicons name="settings" color={"black"} size={24} />
          )
      }}/>
    </Tab.Navigator>
  )
}

export default function Index() {
  return (
    <NavigationContainer independent = {true}>
      <MyTabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    justifyContent: 'center',
    alignContent: 'center',
    fontSize: 20,
    top: 40,
  }
});