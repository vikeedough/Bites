import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState, useRef } from 'react';
import { firebaseAuth } from '@/firebaseConfig'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import AnimatedTextInput from '../AnimatedTextInput';

const auth = firebaseAuth

export default function ResetPassword() {

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const secondInput = useRef();
  const thirdInput = useRef();
  
  // Check if the new password is the same as the new password confirmation
  const checkSamePassword = () => {
    if(newPassword === newPassword2) {
      if (newPassword.length < 6 || newPassword2.length < 6) {
        Alert.alert('Password change failed', 'Please ensure that your new password is at least 6 characters long!', [{text: 'Understood'}]);
      } else {
      updateNewPassword();
      }
    } else {
      Alert.alert('Password change failed', 'Please ensure that both passwords keyed in are the same!', [{text: 'Understood'}]);
    }
  }

  // Update the user's password
  const updateNewPassword = async () => {
    try {
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
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Password change failed', 'The password is invalid.', [{text: 'Understood'}]);
      } else {
      Alert.alert('Password change failed', error.message, [{text: 'Understood'}]);
      }
    }
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
            returnKeyType='Next'
            onSubmitEditing={() => secondInput.current?.focus()}
            blurOnSubmit={false}
          />

          <AnimatedTextInput
            style={styles.AnimatedInput}
            onChangeText={setNewPassword}
            value={newPassword}
            label='Enter your new password'
            secureTextEntry={true}
            ref={secondInput}
            returnKeyType='Next'
            onSubmitEditing={() => thirdInput.current?.focus()}
            blurOnSubmit={false}
          />

          <AnimatedTextInput
            style={styles.AnimatedInput}
            onChangeText={setNewPassword2}
            value={newPassword2}
            label='Enter your new password again'
            secureTextEntry={true}
            ref={thirdInput}
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
