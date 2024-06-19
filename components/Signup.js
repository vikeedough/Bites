import React from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Button } from "react-native";
import { firebaseApp, firebaseAuth, firebaseDb } from '../firebaseConfig'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";

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
          <Text style = {styles.loginText}>Signup</Text>
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
          <View style = {{padding: 10}}>
            <Button title = "Sign up!" onPress = {checkSamePassword} color="#EC6337"/>
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
    color: "#EC6337",
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