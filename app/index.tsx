import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '@/components/HomeScreen.js';
import Map from '@/components/Map.js';
import Login from '@/components/Login.js';
import Post from '@/components/Post.js';
import Signup from '@/components/Signup.js'
import { Ionicons } from '@expo/vector-icons';
import FoodNavigator from "@/components/navigation/FoodNavigator.js";
import {firebaseApp, firebaseAuth} from '../firebaseConfig'
import { onAuthStateChanged, User } from 'firebase/auth';
import SettingsNavigator from '@/components/navigation/SettingsNavigator.js';

const app = firebaseApp
const auth = firebaseAuth
const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const LoadingScreen = () => {
  return(
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Bites</Text>
    </View>
  )
}

function MyTabs() {

  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{
      tabBarStyle: {
        backgroundColor: '#EC6337'
      },
      tabBarActiveTintColor: 'white',  
      tabBarInactiveTintColor: 'black', 
    }}>
      <Tab.Screen name = "Bites" component = {HomeScreen} options={
        {headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 30,
            textAlign: 'center',
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#EC6337'
          },
          tabBarIcon: () => (
            <Ionicons name="home" color={"black"} size={24} />
        )
      }}/>

      <Tab.Screen name = "Map" component = {Map} options={
        { headerStyle: {
          backgroundColor: '#EC6337'
          },
          tabBarIcon: () => (
            <Ionicons name="map" color={"black"} size={24} />
          )
      }}/>

      <Tab.Screen name = "Post" component = {Post} options={
        { headerStyle: {
          backgroundColor: '#EC6337'
          },
          tabBarIcon: () => (
            <Ionicons name="add-circle-outline" color={"black"} size={24} />
          )
      }}/>

      <Tab.Screen name = "FoodNavigator" component = {FoodNavigator} options={{
          tabBarIcon: () => (
            <Ionicons name="book" color={"black"} size={24} />
          ),
          tabBarLabel: 'Journal',
          headerShown: false
      }}/>

      <Tab.Screen name = "SettingsNavigator" component = {SettingsNavigator} options={{
          tabBarIcon: () => (
            <Ionicons name="settings" color={"black"} size={24} />
          ),
          tabBarLabel: 'Settings',
          headerShown: false
      }}/>
    </Tab.Navigator>
  )
}

export default function Index() {

  const [user, setUser] = useState<User | null>(null);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('user', user);
      setUser(user);
      setAppLoading(false);
    })
  }, [])

  return (
    <NavigationContainer independent = {true}>
      {appLoading ?
      <LoadingScreen />
      : (user ? (
         <MyTabs />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name = "Login" component = {Login} options = {{headerShown : false}}/>
          <Stack.Screen name = "Signup" component = {Signup} options = {{headerTitle: ''}}/>
        </Stack.Navigator>
      ))}
      
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
  },
  loadingContainer: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 35,
    color: '#EC6337',
    textAlign: 'center',
  }
});