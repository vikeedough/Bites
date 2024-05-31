import React from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import {firebaseApp, firebaseAuth} from '../firebaseConfig'

const app = firebaseApp
const auth = firebaseAuth

export default function Settings() {

    return (
        <View style = {styles.container}>
          <TouchableOpacity>
            <Text style = {{color: 'blue', margin: 10}} onPress = {() => auth.signOut()}>Sign out</Text>
          </TouchableOpacity>
        </View>
      );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loginText: {
    fontWeight: 'bold',
    fontSize: 30,
    margin: 10,
  },
  input: {
    borderWidth: 0,
    margin: 5,
    width: 150,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },

})