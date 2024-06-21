import React from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Button } from "react-native";
import {firebaseApp, firebaseAuth} from '@/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth';

const app = firebaseApp
const auth = firebaseAuth

export default function Login({navigation}) {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [loading, setLoading] = React.useState(false)

  const signIn = async () => {
    setLoading(true)
    try {
        const response = await signInWithEmailAndPassword(auth, email, password)
        console.log(response)
        alert('Log in successful!')
    } catch (error) {
        console.log(error)
        alert('Log in failed: ' + error.message)
    } finally {
        setLoading(false)
    }
  }

    return (
        <View style = {styles.container}>
          <Text style = {styles.loginText}>Bites</Text>
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
            <Button title = "Log in!" onPress = {signIn} color = '#EC6337' />
          </View>
          <TouchableOpacity>
            <Text style = {{color: '#EC6337', margin: 10}} onPress = {() => navigation.navigate('Signup')}>I don't have an account</Text>
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
    fontSize: 40,
    margin: 10,
    color: '#EC6337'
  },
  input: {
    borderWidth: 0,
    margin: 5,
    width: "80%",
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },

})