import React from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Button, Image } from "react-native";
import {firebaseApp, firebaseAuth} from '@/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth';


const logo = require('@/assets/images/Logo-Grey-Background.png');
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
          <View style={styles.iconContainer}>
            <Image resizeMode='contain' source={logo} style={styles.logo}/>
          </View>
          <View style = {styles.innerContainer}>

            <View style={styles.welcomeContainer}>
              <Text style = {styles.welcomeText}>Welcome!</Text>
              <Text style = {styles.signInText}>Sign in to continue</Text>
            </View>

            <TextInput
              style={styles.input}
              onChangeText={onChangeEmail}
              value={email}
              placeholder='Email'
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangePassword}
              value={password}
              placeholder='Password'
              secureTextEntry = {true}
            />

            <TouchableOpacity style={styles.loginContainer} onPress={signIn}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            <View style={styles.noAccountContainer}>

              <View>
                <Text>Don't have an account? </Text>
              </View>

              <View>
                <TouchableOpacity>
                  <Text style = {{color: '#EC6337'}} 
                  onPress = {() => navigation.navigate('Signup')}>Sign up
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
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '20%',
  },
  logo: {
    height: '50%',
    width: '50%',
  },
  innerContainer: {
    alignItems: 'center',
    display: 'flex',
    width: '90%',
    height: '60%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  noAccountContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  welcomeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    padding: 30,
  },
  totalText: {
    textAlign: 'center',
  },
  welcomeText: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  signInText: {
    fontSize: 18,
    color: 'grey',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D4D4F6',
    margin: 5,
    height: 40,
    paddingLeft: 10,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EC6337',
    height: 40,
    width: '100%',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  loginText: {
    textAlign: 'center',
    color: '#FFFFFF',
  },
  signUpText: {
    color: '#EC6337',
  },
});