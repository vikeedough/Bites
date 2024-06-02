import React from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import {firebaseApp, firebaseAuth} from '../firebaseConfig'

const app = firebaseApp
const auth = firebaseAuth

export default function Settings() {
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>

        <View style={styles.ButtonContainer}>
            <TouchableOpacity>
                <Text style={styles.ButtonText}>Profile</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.ButtonContainer}>
            <TouchableOpacity>
                <Text style={styles.ButtonText}>Goals</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.ButtonContainer}>
            <TouchableOpacity>
                <Text style={styles.ButtonText}>Progress</Text>
            </TouchableOpacity>
        </View>
        
        <View style={styles.ButtonContainer}>
            <TouchableOpacity onPress = {() => auth.signOut()}>
                <Text style={styles.ButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  ButtonContainer: {
    flex: 0.08,
    justifyContent: 'center',
    alignItems: 'left'
  },
  ButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 20
  },
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