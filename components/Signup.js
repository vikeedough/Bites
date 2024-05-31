import React from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Button } from "react-native";
import {firebaseApp, firebaseAuth} from '../firebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const app = firebaseApp
const auth = firebaseAuth

export default function Signup() {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [loading, setLoading] = React.useState(false)

  const signUp = async () => {
    setLoading(true)
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password)
        console.log(response)
        alert('Sign up successful!')
    } catch (error) {
        console.log(error)
        alert('Sign up failed: ' + error.message)
    } finally {
        setLoading(false)
    }
  }

    return (
        <View style = {styles.container}>
          <Text style = {styles.loginText}>Signup</Text>
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
            secureTextEntry = {true}
          />
          <View style = {{padding: 10}}>
            <Button title = "Sign up!" onPress = {signUp} />
          </View>
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
    width: 200,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },

})