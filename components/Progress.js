import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";

export default function Progress() {
    return (
        <View style={styles.containter}>
            <Text>Test</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    containter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

})