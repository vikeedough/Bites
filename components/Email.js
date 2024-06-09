import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { firebaseApp, firebaseAuth, firebaseDb } from '../firebaseConfig'
import { EmailAuthProvider, createUserWithEmailAndPassword, reauthenticateWithCredential, updateEmail } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";

const app = firebaseApp
const auth = firebaseAuth
const db = firebaseDb

export default function Email() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const updateNewEmail = async () => {
    const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
    )
    const result = await reauthenticateWithCredential(
        auth.currentUser,
        credential
    )
    updateEmail(auth.currentUser, email)
    await setDoc(doc(db, "users", auth.currentUser.uid), 
      { email: email }, { merge: true}
    )
    auth.currentUser.reload();
    alert('Your email has been successfully updated!')
  }

  return (
    <View style={styles.container}>

      <View>
        <Text style={styles.text}>Enter your password: </Text>
      </View>
      <View>
        <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        />
      </View>

      <View>
        <Text style={styles.text}>New Email: </Text>
      </View>
      <View>
        <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        />
      </View>
      <View style = {{padding: 10}}>
            <Button title = "Update Email" onPress={updateNewEmail} color = '#ff924a'/>
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
