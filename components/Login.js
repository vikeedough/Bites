import React from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import {firebaseApp, firebaseAuth} from '../firebaseConfig'

const app = firebaseApp
const auth = firebaseAuth

export default function Login() {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');

//   const signIn = async () => {
//     try 
//   }

    return (
        <View style = {styles.container}>
          <Text style = {styles.loginText}>Login</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
            placeholder='email'
          />
          <TextInput
            style={styles.input}
            onChangeText={onChangePassword}
            value={password}
            placeholder='password'
          />
          <TouchableOpacity>
            <Text style = {{color: 'blue', margin: 10}}>I don't have an account</Text>
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