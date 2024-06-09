import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from '@/components/Settings.js';
import Profile from '@/components/Profile.js';
import Goals from '@/components/Goals.js';
import Progress from '@/components/Progress.js';
import ProfileNavigator from "./ProfileNavigator";

const Stack = createNativeStackNavigator();

export default function SettingsNavigator() {
    return(
        <Stack.Navigator initialRouteName="Settings">
            <Stack.Screen name="Settings" component={Settings} options={{
                headerStyle: {
                    backgroundColor: '#ff924a'
                  },
            }}/>
            <Stack.Screen name="ProfileNavigator" component={ProfileNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name="Goals" component={Goals}/>
            <Stack.Screen name="Progress" component={Progress}/>
        </Stack.Navigator>
    )
}