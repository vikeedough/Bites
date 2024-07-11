import {StyleSheet, View, Text} from 'react-native';

export default function ViewProfile({ route }) {

    const { user } = route.params;

    return (
        <View style={styles.container}>
            <Text>{user}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
})