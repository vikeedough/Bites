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
          <View style = {styles.innerContainer}>
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

            <View style={styles.noAccountContainer}>

              <View>
                <Text>Don't have an account? </Text>
              </View>

              <View>
                <TouchableOpacity>
                  <Text style = {{color: '#EC6337'}} 
                  onPress = {() => navigation.navigate('Signup')}>Sign up here!
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
            
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
  container: { 
    display: 'flex',
    height: '100%',
    width: '100%',
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F4F4F6',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    width: '90%',
    height: '70%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  noAccountContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '10%',
  },
  totalText: {
    textAlign: 'center',
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
    height: '8%',
    width: "80%",
    borderRadius: 10,
    backgroundColor: '#F4F4F6',
    textAlign: 'center',
  },

})