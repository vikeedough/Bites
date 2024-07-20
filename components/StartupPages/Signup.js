import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { firebaseAuth, firebaseDb } from '@/firebaseConfig'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import AnimatedTextInput from '../AnimatedTextInput';
import * as Progress from 'react-native-progress';

const logo = require('@/assets/images/Logo-Grey-Background.png');
const auth = firebaseAuth
const db = firebaseDb

export default function Signup() {
  const [username, onChangeUsername] = React.useState('');
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [confirmation, onChangeConfirmation] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

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
    setDisabled(true);
    setLoading(true)
    try {
        const response = await createUserWithEmailAndPassword(auth, email, password)
        updateProfile(auth.currentUser, { displayName: username })
        await setDoc(doc(db, "users", auth.currentUser.uid), 
        { username: username, 
          vegetarian: false, 
          email: email, 
          friends: [],
          Achievements: [],
          selectedAchievement: '',
          goals: ['', '', '', '', '', ''],
          macroGoals: [0, 0, 0, 0],
          numberOfPosts: 0,
          numberOfFoodLogs: 0
        },
        { merge: true }
        )
    } catch (error) {
        console.log(error)
        alertMessage(error.code);
    } finally {
        setLoading(false);
        setDisabled(false);
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

        {
            loading && (
                <View style={styles.loadingContainer}>
                    <Progress.Circle size={50} indeterminate={true} color={'#EC6337'} borderWidth={4}/>
                </View>
            )

        }

      <View style={styles.iconContainer}>
        <Image resizeMode='contain' source={logo} style={styles.logo}/>
      </View>
      <View style = {styles.innerContainer}>

        <View style={styles.welcomeContainer}>
          <Text style = {styles.welcomeText}>Join the community!</Text>
          <Text style = {styles.signInText}>Sign up to continue</Text>
        </View>

        <AnimatedTextInput
          style={styles.AnimatedInput}
          onChangeText={onChangeUsername}
          value={username}
          label='Username'
        />

        {/* <TextInput
          style={styles.input}
          onChangeText={onChangeUsername}
          value={username}
          placeholder='username'
          /> */}

        <AnimatedTextInput
          style={styles.AnimatedInput}
          onChangeText={onChangeEmail}
          value={email}
          label='Email'
        /> 

        {/* <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder='email'
        /> */}

        <AnimatedTextInput
          style={styles.AnimatedInput}
          onChangeText={onChangePassword}
          value={password}
          label='Password'
          secureTextEntry = {true}
        />

        <AnimatedTextInput
          style={styles.AnimatedInput}
          onChangeText={onChangeConfirmation}
          value={confirmation}
          label='Re-enter your password'
          secureTextEntry = {true}
        />

        {/* <TextInput
          style={styles.input}
          onChangeText={onChangeConfirmation}
          value={confirmation}
          placeholder='re-enter your password'
          secureTextEntry = {true}
        /> */}

        <TouchableOpacity style={styles.loginContainer} onPress={checkSamePassword} disabled={disabled}>
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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});