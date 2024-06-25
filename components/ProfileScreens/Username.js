import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { firebaseApp, firebaseAuth, firebaseDb } from '../../firebaseConfig'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import AnimatedTextInput from '../AnimatedTextInput';

const app = firebaseApp
const auth = firebaseAuth
const db = firebaseDb

export default function App() {

  const [username, setUsername] = useState('')

  const updateUsername = async () => {
    if (username.length < 5) {
      Alert.alert('Update username failed', 'Please enter a username that is at least 5 characters long!', [{text: 'Understood'}]);
    } else {
      updateProfile(auth.currentUser, { displayName: username })
      await setDoc(doc(db, "users", auth.currentUser.uid), 
        { username: username }, { merge: true}
      )
      auth.currentUser.reload();
      Alert.alert('', 'Username successfully updated!', [{text: 'Understood'}]);
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.innerContainer}>

        <View style={styles.inputContainer}>
          <AnimatedTextInput
            style={styles.AnimatedInput}
            onChangeText={setUsername}
            value={username}
            label='Username'
          />
        </View>

        <TouchableOpacity style={styles.updateButton} onPress={updateUsername}>
          <Text style={styles.buttonText}>Update Username</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    padding: 15,
    backgroundColor:  '#F4F4F6',
  },
  innerContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
  },
  updateButton: {
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EC6337',
    borderRadius: 10,
    width: '70%',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    textAlign: 'center',
    height: 30,
  },
  inputContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  AnimatedInput: {
    height: 35,
    width: '90%',
    marginVertical: 15,
  },
});
