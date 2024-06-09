import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { firebaseApp, firebaseAuth, firebaseDb } from '../firebaseConfig'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";

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
      alert('Ensure that both passwords are the same!')
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
    alert('Your password has been successfully changed!')
  }

  return (
    <View style={styles.container}>

      <View>
        <Text style={styles.text}>Enter your password: </Text>
      </View>
      <View>
        <TextInput
        style={styles.input}
        onChangeText={setOldPassword}
        value={oldPassword}
        secureTextEntry={true}
        />
      </View>

      <View>
        <Text style={styles.text}>New Password: </Text>
      </View>
      <View>
        <TextInput
        style={styles.input}
        onChangeText={setNewPassword}
        value={newPassword}
        secureTextEntry={true}
        />
      </View>

      <View>
        <Text style={styles.text}>Enter New Password Again: </Text>
      </View>
      <View>
        <TextInput
        style={styles.input}
        onChangeText={setNewPassword2}
        value={newPassword2}
        secureTextEntry={true}
        />
      </View>

      <View style = {{padding: 10}}>
            <Button title = "Update Password" onPress={checkSamePassword} color = '#ff924a'/>
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  text: {
    fontWeight: 'bold',
    paddingVertical: 10,
    fontSize: 20
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    textAlign: 'center',
    height: 30,
  }
});
