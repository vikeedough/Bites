import React from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Button, Image, Alert } from "react-native";
import { firebaseApp, firebaseAuth, firebaseDb } from '@/firebaseConfig'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import AnimatedTextInput from '../AnimatedTextInput';

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
  const secondInput = React.useRef();
  const thirdInput = React.useRef();
  const fourthInput = React.useRef();

  const alertMessage = (error) => {
    let message = '';
    switch(error) {
      case 'auth/invalid-email': 
        message = 'Please enter a valid email!';
        break;
      case 'auth/missing-password':
        message = 'Please enter your password!';
        break;
      case 'auth/wrong-password':
        message = 'Invalid password!';
        break;
      case 'auth/user-not-found':
        message = 'The email you keyed in is not a registered with us. Please create a new account!';
        break;
      default:
        message = 'An unknown error occurred. Please try again later.';
        console.log(error);
    }
    Alert.alert('Log in failed', message, [{text: 'Understood'}]);
  };

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
    } catch (error) {
        console.log(error)
        alertMessage(error.code);
    } finally {
        setLoading(false)
    } 
  }

  const checkSamePassword = () => {
    if (username.length < 5) {
      Alert.alert('Sign up failed', 'Please enter a username that is at least 5 characters long!', [{text: 'Understood'}]);
    } else if (password === confirmation) {
      signUp();
    } else {
      Alert.alert('Sign up failed', 'Please ensure that both passwords keyed in are the same!', [{text: 'Understood'}]);
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

        {/* <AnimatedTextInput
          style={styles.AnimatedInput}
          onChangeText={onChangeUsername}
          value={username}
          label='Username'
          returnKeyType='Next'
          onSubmitEditing={() => secondInput.current?.focus()}
          blurOnSubmit={false}
        /> */}

        <TextInput
          style={styles.input}
          onChangeText={onChangeUsername}
          value={username}
          placeholder='Username'
          returnKeyType='Next'
          onSubmitEditing={() => secondInput.current?.focus()}
          blurOnSubmit={false}
          />

        {/* <AnimatedTextInput
          style={styles.AnimatedInput}
          onChangeText={onChangeEmail}
          value={email}
          label='Email'
          ref={secondInput}
          returnKeyType='Next'
          onSubmitEditing={() => thirdInput.current?.focus()}
          blurOnSubmit={false}
        />  */}

        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder='Email'
          ref={secondInput}
          returnKeyType='Next'
          onSubmitEditing={() => thirdInput.current?.focus()}
          blurOnSubmit={false}
        />

        {/* <AnimatedTextInput
          style={styles.AnimatedInput}
          onChangeText={onChangePassword}
          value={password}
          label='Password'
          secureTextEntry = {true}
          ref={thirdInput}
          returnKeyType='Next'
          onSubmitEditing={() => fourthInput.current?.focus()}
          blurOnSubmit={false}
        /> */}

        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          placeholder='Password'
          secureTextEntry = {true}
          ref={thirdInput}
          returnKeyType='Next'
          onSubmitEditing={() => fourthInput.current?.focus()}
          blurOnSubmit={false}
        />

        {/* <AnimatedTextInput
          style={styles.AnimatedInput}
          onChangeText={onChangeConfirmation}
          value={confirmation}
          label='Re-enter your password'
          secureTextEntry = {true}
          ref={fourthInput}
        /> */}

        <TextInput
          style={styles.input}
          onChangeText={onChangeConfirmation}
          value={confirmation}
          placeholder='Re-enter your password'
          secureTextEntry = {true}
          ref={fourthInput}
        />

        <TouchableOpacity style={styles.loginContainer} onPress={checkSamePassword}>
            <Text style={styles.loginText}>SIGN UP</Text>
        </TouchableOpacity>

        
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
  AnimatedInput: {
    height: 35,
    width: '100%',
    marginVertical: 10,
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