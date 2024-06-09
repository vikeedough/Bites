import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

export default function Friends({navigation}){

    const [search, setSearch] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSearch}
                        value={search}
                    />
                </View>
                
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.addFriends} onPress={() => navigation.navigate("Add Friends")}>
                        <Text>Add Friends</Text>
                    </TouchableOpacity>
                </View>
                
                
            </View>
            <ScrollView contentContainerStyle={styles.bottomContainer}>
                <Text>Friends!</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    inputContainer: {
        padding: 15,
        flex: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ff924a',
        height: 35,
    },
    buttonContainer: {
        flex: 2,
        paddingVertical: 15,
        paddingRight: 15,
    },
    bottomContainer: {
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addFriends: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        borderRadius: 8,
        backgroundColor: '#ff924a',
    }

});