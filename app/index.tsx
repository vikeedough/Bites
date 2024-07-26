import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'
import FeedNavigator from '@/components/navigation/FeedNavigator.js';
import Map from '@/components/Map.js';
import Login from '@/components/StartupPages/Login';
import Signup from '@/components/StartupPages/Signup.js'
import PasswordReset from '@/components/StartupPages/PasswordReset.js';
import { Ionicons } from '@expo/vector-icons';
import FoodNavigator from "@/components/navigation/FoodNavigator.js";
import {firebaseApp, firebaseAuth} from '../firebaseConfig'
import { onAuthStateChanged, User } from 'firebase/auth';
import MainProfileNavigator from '@/components/navigation/MainProfileNavigator.js';
import PostNavigator from '../components/navigation/PostNavigator.js';

const auth = firebaseAuth
const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const LoadingScreen = () => {
  return(
    <View style={styles.loadingContainer}>
      <Image 
        source={require('@/assets/images/new-splash.png')}
        resizeMode='contain'
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
      tabBarActiveTintColor: 'white',  
      tabBarInactiveTintColor: '#F6B19B', 
    }}>
      <Tab.Screen 
        name = "Bites" 
        component = {FeedNavigator} 
        options={{
          headerShown: false,
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

            <View style={styles.iconContainer}>
              <Ionicons name="home" color={focused ? "white" : '#F6B19B'} size={24} />
            </View>
            
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
            
            <View style={styles.iconContainer}>
              <Ionicons name="map" color={focused ? "white" : '#F6B19B'} size={24} />
            </View>

          )
      }}/>

      <Tab.Screen name = "Post" component = {PostNavigator} options={
        { headerShown: false,
          headerStyle: {
          backgroundColor: '#EC6337'
          },
          headerTitleStyle: {
            color: '#FFFFFF'
          },
          tabBarIcon: ({focused}) => (

            <View style={styles.iconContainer}>
              <Ionicons name="add-circle-outline" color={focused ? "white" : '#F6B19B'} size={24} />
            </View>

          )
      }}/>

      <Tab.Screen name = "FoodNavigator" component = {FoodNavigator} options={{
          tabBarIcon: ({focused}) => (

            <View style={styles.iconContainer}>
              <Ionicons name="book" color={focused ? "white" : '#F6B19B'} size={24} />
            </View>

          ),
          tabBarLabel: 'Journal',
          headerShown: false
      }}/>

      <Tab.Screen name = "MainProfileNavigator" component = {MainProfileNavigator} options={{
          tabBarIcon: ({focused}) => (

            <View style={styles.iconContainer}>
              <Ionicons name="person-circle-outline" color={focused ? "white" : '#F6B19B'} size={24} />
            </View>

          ),
          tabBarLabel: 'Profile',
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
          <Stack.Screen name = "Signup" component = {Signup} options = {{
            headerTitle: '', 
            headerStyle: {
              backgroundColor: '#F4F4F6',
              borderBottomWidth: 0,
            },
            }}
          />
          <Stack.Screen name = "PasswordReset" component = {PasswordReset} options = {{
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#F4F4F6',
              borderBottomWidth: 0,
            },
            }}
          />
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
  },
  iconContainer: {
    marginTop: 4,
  }
});