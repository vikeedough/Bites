import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { firebaseApp, firebaseAuth, firebaseDb } from '@/firebaseConfig'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import AnimatedTextInput from '../AnimatedTextInput';

const app = firebaseApp
const auth = firebaseAuth
const db = firebaseDb

export default function ResetPassword() {

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  
  const checkSamePassword = () => {
    if(newPassword === newPassword2) {
      updateNewPassword();
    } else {
      Alert.alert('Password change failed', 'Please ensure that both passwords keyed in are the same!', [{text: 'Understood'}]);
    }
  }

  const updateNewPassword = async () => {
    const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        oldPassword
    )
    const result = await reauthenticateWithCredential(
        auth.currentUser,
        credential
    )
    updatePassword(auth.currentUser, newPassword)
    auth.currentUser.reload();
    Alert.alert('', 'Your password has been successfully changed!', [{text: 'Understood'}]);
  }

  return (
    <View style={styles.container}>

      <View style={styles.innerContainer}>

        <View style={styles.inputContainer}>

          <AnimatedTextInput
            style={styles.AnimatedInput}
            onChangeText={setOldPassword}
            value={oldPassword}
            label='Enter your current password'
            secureTextEntry={true}
          />

          <AnimatedTextInput
            style={styles.AnimatedInput}
            onChangeText={setNewPassword}
            value={newPassword}
            label='Enter your new password'
            secureTextEntry={true}
          />

          <AnimatedTextInput
            style={styles.AnimatedInput}
            onChangeText={setNewPassword2}
            value={newPassword2}
            label='Enter your new password again'
            secureTextEntry={true}
          />

        </View>

        <TouchableOpacity style={styles.updateButton} onPress={checkSamePassword}>
          <Text style={styles.buttonText}>Update Password</Text>
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
