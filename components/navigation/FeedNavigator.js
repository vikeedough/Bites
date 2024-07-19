import React from "react";
import { Image } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from '@/components/HomeComponent/HomeScreen.js';
import ViewProfile from "../HomeComponent/ViewProfile";
import ViewLikes from "../HomeComponent/ViewLikes";
import ViewTags from '../HomeComponent/ViewTags';
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

export default function FeedNavigator() {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{
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
            }}/>
            <Stack.Screen name="ViewProfile" component={ViewProfile} options={{
                headerShown: true,
                headerTitle: 'Profile',
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTintColor: '#FFFFFF'
            }}/>
            <Stack.Screen name="ViewLikes" component={ViewLikes} options={{
                headerTitle: 'Likes',
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTintColor: '#FFFFFF'
            }}/>
            <Stack.Screen name="ViewTags" component={ViewTags} options={{
                headerTitle: 'Tags',
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTintColor: '#FFFFFF'
            }}/>
        </Stack.Navigator>
    )
}