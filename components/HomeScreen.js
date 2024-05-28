import React from 'react';
import { Text, View, StyleSheet } from "react-native";
import { Header } from 'react-native/Libraries/NewAppScreen';

export default function HomeScreen() {
    return (
        <View style = {styles.container}>
            <Text style = {styles.header}> Bites </Text>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      position: 'absolute',
      justifyContent: 'center',
      alignContent: 'center',
      fontSize: 20,
      top: 40,
    }
  });