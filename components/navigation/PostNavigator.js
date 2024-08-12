import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Post from '../PostComponent/Post.js';
import AddLocation from '../PostComponent/AddLocation.js';
import TagFriends from '../PostComponent/TagFriends.js';

const Stack = createNativeStackNavigator();

export default function PostNavigator() {
    return(
        <Stack.Navigator>
            <Stack.Screen name="PostScreen" component={Post} options={{
                headerShown: true,
                headerTitle: 'Post',
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTintColor: '#FFFFFF'
            }}/>
            <Stack.Screen name="AddLocation" component={AddLocation} options={{
                headerShown: true,
                headerTitle: 'Add Location',
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTintColor: '#FFFFFF'
            }}/>
            <Stack.Screen name="TagFriends" component={TagFriends} options={{
                headerShown: true,
                headerTitle: 'Tag Friends',
                headerStyle: {
                    backgroundColor: '#EC6337'
                },
                headerTintColor: '#FFFFFF'
            }}/>
        </Stack.Navigator>
    )
}