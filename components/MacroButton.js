import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';

export default function MacroButton() {
    return (
        <View style={styles.macrosContainer}>
          <TouchableOpacity>
            <Text style={styles.macroNumber}>1000g</Text>
          </TouchableOpacity>
            <Text style={styles.macrosText}>Test</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    macrosContainer: {
        flex: 0.25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    macroNumber: {
        fontSize: 20
    },
    macrosText: {
        fontSize: 12,
        paddingTop: 5
    }
});