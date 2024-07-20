import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainProfile from "../ProfileComponent/MainProfile";
import SettingsNavigator from "./SettingsNavigator";
import ViewProfile from "../HomeComponent/ViewProfile";
import ViewLikes from "../HomeComponent/ViewLikes";
import ViewTags from "../HomeComponent/ViewTags";
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

export default function MainProfileNavigator({navigation}) {
    return(
        <Stack.Navigator initialRouteName="Profile">
            <Stack.Screen name="Profile" component={MainProfile} options={{
                headerTitle: "Profile",
                headerRight: () => (
                    <Ionicons name="settings" color={'white'} size={24} onPress={() => navigation.navigate('SettingsNavigator')} />
                ),
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTitleStyle: {
                    color: '#FFFFFF'
                },
            }}/>
            <Stack.Screen name="SettingsNavigator" component={SettingsNavigator} options={{
                headerShown: false,
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