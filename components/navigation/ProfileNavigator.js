import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from '../ProfileComponent/Profile.js';
import Username from '@/components/ProfileScreens/Username.js';
import Email from '@/components/ProfileScreens/Email.js';
import ResetPassword from '@/components/ProfileScreens/ResetPassword.js';

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={Profile} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTintColor: '#FFFFFF'
            }}/>
            <Stack.Screen name="Change Username" component={Username} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTintColor: '#FFFFFF'
            }}/>
            <Stack.Screen name="Change Email" component={Email} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTintColor: '#FFFFFF'
            }}/>
            <Stack.Screen name="Reset Password" component={ResetPassword} options={{
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTintColor: '#FFFFFF',
            }}/>
        </Stack.Navigator>
    )
}