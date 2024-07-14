import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainProfile from "../MainProfile";
import SettingsNavigator from "./SettingsNavigator";
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
        </Stack.Navigator>
    )
}