import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Journal from "@/components/Journal.js";
import Food from "@/components/Food.js";

const Stack = createNativeStackNavigator();

export default function JournalToFoodNavigator() {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Journal" component={Journal} options={{
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