import React from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Button, Image } from "react-native";
import { firebaseApp, firebaseAuth, firebaseDb } from '@/firebaseConfig'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";

const logo = require('@/assets/images/Logo-Grey-Background.png');
const app = firebaseApp
const auth = firebaseAuth
const db = firebaseDb

export default function Signup() {
  const [username, onChangeUsername] = React.useState('');
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [confirmation, onChangeConfirmation] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const signUp = async () => {
    setLoading(true)
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password)
        updateProfile(auth.currentUser, { displayName: username })
        await setDoc(doc(db, "users", auth.currentUser.uid), 
        { username: username, 
          vegetarian: false, 
          email: email, 
          friends: [], 
          goals: ['', '', '', '', '', ''],
          macroGoals: [0, 0, 0, 0],
         },
         { merge: true }
        )
        alert('Sign up successful!')
    } catch (error) {
        console.log(error)
        alert('Sign up failed: ' + error.message)
    } finally {
        setLoading(false)
    } 
  }

  const checkSamePassword = () => {
    if(password === confirmation) {
      signUp();
    } else {
      alert('Ensure that both passwords are the same!')
    }
  }

    return (
      <View style = {styles.container}>
      <View style={styles.iconContainer}>
        <Image resizeMode='contain' source={logo} style={styles.logo}/>
      </View>
      <View style = {styles.innerContainer}>

        <View style={styles.welcomeContainer}>
          <Text style = {styles.welcomeText}>Join the community!</Text>
          <Text style = {styles.signInText}>Sign up to continue</Text>
        </View>

        <TextInput
          style={styles.input}
          onChangeText={onChangeUsername}
          value={username}
          placeholder='username'
          />

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

        <TextInput
          style={styles.input}
          onChangeText={onChangeConfirmation}
          value={confirmation}
          placeholder='re-enter your password'
          secureTextEntry = {true}
        />

        <TouchableOpacity style={styles.loginContainer} onPress={checkSamePassword}>
            <Text style={styles.loginText}>SIGN UP</Text>
        </TouchableOpacity>

        
      </View>
    </View>

        // <View style = {styles.container}>
        //   <Text style = {styles.loginText}>Signup</Text>
        //   <TextInput
        //     style={styles.input}
        //     onChangeText={onChangeUsername}
        //     value={username}
        //     placeholder='username'
        //   />
        //   <TextInput
        //     style={styles.input}
        //     onChangeText={onChangeEmail}
        //     value={email}
        //     placeholder='email'
        //   />
        //   <TextInput
        //     style={styles.input}
        //     onChangeText={onChangePassword}
        //     value={password}
        //     placeholder='password'
        //     secureTextEntry = {true}
        //   />
        //   <TextInput
        //     style={styles.input}
        //     onChangeText={onChangeConfirmation}
        //     value={confirmation}
        //     placeholder='re-enter your password'
        //     secureTextEntry = {true}
        //   />
        //   <View style = {{padding: 10}}>
        //     <Button title = "Sign up!" onPress = {checkSamePassword} color="#EC6337"/>
        //   </View>
        // </View>
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
    height: '70%',
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