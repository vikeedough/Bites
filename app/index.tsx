import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from "react-native";
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
      <Image 
        source={require('@/assets/images/new-splash.png')}
      />
    </View>
  )
}

function MyTabs() {

  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{
      tabBarStyle: {
        backgroundColor: '#EC6337',
        paddingBottom: 5,
      },
      tabBarActiveTintColor: 'black',  
      tabBarInactiveTintColor: 'white', 
    }}>
      <Tab.Screen name = "Bites" component = {HomeScreen} options={
        {headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <Image
              source={require('@/assets/images/new-adaptive-icon.png')}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
          ),
          headerStyle: {
            backgroundColor: '#EC6337'
          },
          tabBarIcon: ({focused}) => (
            <Ionicons name="home" color={focused ? "black" : 'white'} size={24} />
        )
      }}/>

      <Tab.Screen name = "Map" component = {Map} options={
        { headerStyle: {
          backgroundColor: '#EC6337'
          },
          headerTitleStyle: {
            color: '#FFFFFF'
          },
          tabBarIcon: ({focused}) => (
            <Ionicons name="map" color={focused ? "black" : 'white'} size={24} />
          )
      }}/>

      <Tab.Screen name = "Post" component = {Post} options={
        { headerStyle: {
          backgroundColor: '#EC6337'
          },
          headerTitleStyle: {
            color: '#FFFFFF'
          },
          tabBarIcon: ({focused}) => (
            <Ionicons name="add-circle-outline" color={focused ? "black" : 'white'} size={24} />
          )
      }}/>

      <Tab.Screen name = "FoodNavigator" component = {FoodNavigator} options={{
          tabBarIcon: ({focused}) => (
            <Ionicons name="book" color={focused ? "black" : 'white'} size={24} />
          ),
          tabBarLabel: 'Journal',
          headerShown: false
      }}/>

      <Tab.Screen name = "SettingsNavigator" component = {SettingsNavigator} options={{
          tabBarIcon: ({focused}) => (
            <Ionicons name="settings" color={focused ? "black" : 'white'} size={24} />
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