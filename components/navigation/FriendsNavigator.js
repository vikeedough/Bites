import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Friends from '../ProfileComponent/Friends.js';
import AddFriends from '../ProfileComponent/AddFriends.js';
import ViewProfile from "../HomeComponent/ViewProfile";

const Stack = createNativeStackNavigator();

export default function FriendsNavigator() {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Friends" component={Friends} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTintColor: '#FFFFFF',
            }}/>
            <Stack.Screen name="ViewProfile" component={ViewProfile} options={{
                headerShown: true,
                headerTitle: 'Profile',
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTintColor: '#FFFFFF'
            }}/>
            <Stack.Screen name="Add Friends" component={AddFriends} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTintColor: '#FFFFFF',
            }}/>
        </Stack.Navigator>
    )
}