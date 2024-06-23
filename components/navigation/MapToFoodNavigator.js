import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Food from '@/components/JournalComponent/Food.js';
import Map from '@/components/Map.js';

const Stack = createNativeStackNavigator();

export default function MapToFoodNavigator() {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Map" component={Map} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
            }}/>
            <Stack.Screen name="Food" component={Food} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
            }}/>
        </Stack.Navigator>
    )
}