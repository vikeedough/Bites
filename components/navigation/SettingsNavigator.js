import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from '@/components/Settings.js';
import Profile from '@/components/Profile.js';
import Goals from '@/components/GoalsComponent/Goals.js';
import Achievements from "@/components/AchievementComponent/Achievements.js";
import ProfileNavigator from "./ProfileNavigator";
import Friends from "@/components/Friends.js";
import FriendsNavigator from"./FriendsNavigator";

const Stack = createNativeStackNavigator();

export default function SettingsNavigator() {
    return(
        <Stack.Navigator initialRouteName="Settings">
            <Stack.Screen name="Settings" component={Settings} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                  },
                  headerTitleStyle: {
                    color: '#FFFFFF'
                  },
            }}/>
            <Stack.Screen name="ProfileNavigator" component={ProfileNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name="FriendsNavigator" component={FriendsNavigator} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="Goals" component={Goals} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                  },
            }}/>
            <Stack.Screen name="Achievements" component={Achievements} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                  },
            }}/>
        </Stack.Navigator>
    )
}