import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRef, useState } from 'react';
import { firebaseAuth, firebaseDb } from '@/firebaseConfig'
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import AnimatedTextInput from '../AnimatedTextInput';

const auth = firebaseAuth
const db = firebaseDb

export default function Email() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const secondInput = useRef();

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
    Alert.alert('', 'Your email has been successfully updated!', [{text: 'Understood'}]);
  }

  return (
    <View style={styles.container}>

      <View style={styles.innerContainer}>

        <View style={styles.inputContainer}>

          <AnimatedTextInput
            style={styles.AnimatedInput}
            onChangeText={setPassword}
            value={password}
            label='Enter your password'
            secureTextEntry={true}
            returnKeyType='Next'
            onSubmitEditing={() => secondInput.current?.focus()}
            blurOnSubmit={false}
          />

          <AnimatedTextInput
            style={styles.AnimatedInput}
            onChangeText={setEmail}
            value={email}
            label='New Email'
            ref={secondInput}
          />

        </View>

        <TouchableOpacity style={styles.updateButton} onPress={updateNewEmail}>
          <Text style={styles.buttonText}>Update Email</Text>
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
