import React from 'react';
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/components/HomeScreen.js';
import Map from '@/components/Map.js';
import Journal from '@/components/Journal.js';
import Settings from '@/components/Settings.js';

const Tab = createBottomTabNavigator()

function MyTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name = "Home" component = {HomeScreen}  options={{headerShown: false}}/>
      <Tab.Screen name = "Map" component = {Map} />
      <Tab.Screen name = "Journal" component = {Journal} />
      <Tab.Screen name = "Settings" component = {Settings} />
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