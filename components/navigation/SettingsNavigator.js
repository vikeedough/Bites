import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from '@/components/Settings.js';
import Profile from '@/components/Profile.js';
import Goals from '@/components/Goals.js';
import Progress from '@/components/Progress.js';

const Stack = createNativeStackNavigator();

export default function SettingsNavigator() {
    return(
        <Stack.Navigator initialRouteName="Settings">
            <Stack.Screen name="Settings" component={Settings}/>
            <Stack.Screen name="Profile" component={Profile}/>
            <Stack.Screen name="Goals" component={Goals}/>
            <Stack.Screen name="Progress" component={Progress}/>
        </Stack.Navigator>
    )
}