import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { firebaseApp, firebaseAuth, firebaseDb } from '../firebaseConfig'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";

const app = firebaseApp
const auth = firebaseAuth
const db = firebaseDb

export default function App() {

  const [username, setUsername] = useState('')

  const updateUsername = async () => {
    updateProfile(auth.currentUser, { displayName: username })
    await setDoc(doc(db, "users", auth.currentUser.uid), 
      { username: username }, { merge: true}
    )
    auth.currentUser.reload();
    alert('Your username has been successfully changed!')
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>New Username</Text>
      </View>
      <View>
        <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        />
      </View>
      <View style = {{padding: 10}}>
            <Button title = "Update Username" onPress={updateUsername} color = '#ff924a'/>
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
