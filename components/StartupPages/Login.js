import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { firebaseAuth } from '../../firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Fontisto, Feather } from '@expo/vector-icons';
import AnimatedTextInput from '../AnimatedTextInput';

const logo = require('@/assets/images/Logo-Grey-Background.png');
const auth = firebaseAuth

export default function Login({navigation}) {
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const firstInput = React.useRef();
  const secondInput = React.useRef();

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

  const signIn = async () => {
    setLoading(true)
    try {
        const response = await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        alertMessage(error.code);
    } finally {
        setLoading(false)
    }
  }

    return (
        <View style = {styles.container}>
          <View style={styles.iconContainer}>
            <Image resizeMode='contain' source={logo} style={styles.logo}/>
          </View>
          <View style = {styles.innerContainer}>

            <View style={styles.welcomeContainer}>
              <Text style = {styles.welcomeText}>Welcome!</Text>
              <Text style = {styles.signInText}>Sign in to continue</Text>
            </View>

            <View style={styles.textInputContainer}>
              <Fontisto
                name="email"
                color='#EC6337'
                size={20}
                style={{paddingEnd: 0, paddingTop: 8,}}
              />
              {/* <TextInput 
                style={styles.input}
                testID='emailInput'
                placeholder='Email'
                value={email}
                onChangeText={onChangeEmail}
                returnKeyType='Next'
                onSubmitEditing={() => secondInput.current?.focus()}
                blurOnSubmit={false}
              /> */}
              <AnimatedTextInput
                style={styles.AnimatedInput}
                testID='emailInput'
                label='Email'
                value={email}
                onChangeText={onChangeEmail}
                returnKeyType='Next'
                onSubmitEditing={() => secondInput.current?.focus()}
                blurOnSubmit={false}
                ref={firstInput}
              />
            </View>

            <View style={styles.textInputContainer}>
              <Feather
                name="lock"
                color='#EC6337'
                size={20}
                style={{paddingEnd: 0, paddingTop: 8}}
              />
              {/* <TextInput 
                style={styles.input}
                testID='passwordInput'
                placeholder='Password'
                value={password}
                onChangeText={onChangePassword}
                ref={secondInput}
                secureTextEntry={true}
              /> */}
              <AnimatedTextInput
                style={styles.AnimatedInput}
                testID='passwordInput'
                onChangeText={onChangePassword}
                value={password}
                label='Password'
                secureTextEntry = {true}
                ref={secondInput}
              />
            </View>
            

            <TouchableOpacity style={styles.loginContainer} testID='loginButton' onPress={signIn}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            <View style={styles.noAccountContainer}>

              <View>
                <Text>Don't have an account? </Text>
              </View>

              <View>
                <TouchableOpacity>
                  <Text style = {{color: '#EC6337'}} 
                  onPress = {() => navigation.navigate('Signup')}>Sign up
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
            
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
    height: '60%',
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
  textInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    width: '100%',
    marginVertical: 5,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D4D4F6',
    margin: 5,
    height: 40,
    paddingLeft: 10,
    width: '87%',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  AnimatedInput: {
    height: 35,
    width: '90%',
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