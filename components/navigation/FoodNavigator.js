import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Journal from "@/components/JournalComponent/Journal.js";
import Food from "@/components/JournalComponent/Food.js";

const Stack = createNativeStackNavigator();

export default function JournalToFoodNavigator() {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Journal" component={Journal} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTitleStyle: {
                    color: '#FFFFFF'
                },
            }}/>
            <Stack.Screen name="Food" component={Food} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTitle: 'Add Food Entry',
                headerTintColor: '#FFFFFF'
            }}/>
        </Stack.Navigator>
    )
}