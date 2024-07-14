import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from '@/components/Settings.js';
import Goals from '@/components/GoalsComponent/Goals.js';
import Progress from '@/components/Progress.js';
import ProfileNavigator from "./ProfileNavigator";
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
                headerTintColor: '#FFFFFF'
            }}/>
            <Stack.Screen name="ProfileNavigator" component={ProfileNavigator} options={{ headerShown: false }}/>
            <Stack.Screen name="FriendsNavigator" component={FriendsNavigator} options={{
                headerShown: false
            }}/>
            <Stack.Screen name="Goals" component={Goals} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTintColor: '#FFFFFF'
            }}/>
            <Stack.Screen name="Progress" component={Progress} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTitle: 'Achievements',
                headerTintColor: '#FFFFFF'
            }}/>
        </Stack.Navigator>
    )
}