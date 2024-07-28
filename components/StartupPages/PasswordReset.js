import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { firebaseAuth } from '../../firebaseConfig'
import { sendPasswordResetEmail } from 'firebase/auth';
import { Fontisto } from '@expo/vector-icons';
import AnimatedTextInput from '../AnimatedTextInput';

const logo = require('@/assets/images/Logo-Grey-Background.png');
const auth = firebaseAuth;

export default function PasswordReset({navigation}) {
    const [email, onChangeEmail] = React.useState('');

    // Send password reset email
    const sendEmail = async () => {
        if('' === email) {
            Alert.alert('Error', 'Please enter your email address.', [{text: 'Understood'}]);
            return;
        }    
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Password reset email sent', 'A password reset email has been sent to your email address. Please check your email inbox.', [{text: 'Understood'}]);
            navigation.navigate('Login');
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                Alert.alert('Error', 'Please enter a valid email address.', [{text: 'Understood'}]);
            } else {
                Alert.alert('Error', 'An error occurred while sending the password reset email. Please try again later.', [{text: 'Understood'}]);
                console.log(error);
            }    
        }
    }   

    return (
        <View style = {styles.container}>
        <View style={styles.iconContainer}>
        <Image resizeMode='contain' source={logo} style={styles.logo}/>
        </View>
        <View style = {styles.innerContainer}>

        <View style={styles.welcomeContainer}>
            <Text style = {styles.welcomeText}>Forgot your password?</Text>
            <Text style = {styles.signInText}>Enter your password below and we'll send a password reset email to you!</Text>
        </View>

        <View style={styles.textInputContainer}>
            <Fontisto
            name="email"
            color='#EC6337'
            size={20}
            style={{paddingEnd: 0, paddingTop: 8,}}
            />
            <AnimatedTextInput
            style={styles.AnimatedInput}
            testID='emailInput'
            label='Email'
            value={email}
            onChangeText={onChangeEmail}
            />
        </View>

        <TouchableOpacity style={styles.loginContainer} onPress={sendEmail} >
            <Text style={styles.loginText}>Send Pasword Reset Email</Text>
        </TouchableOpacity>
        
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
    alignItems: 'center',
    width: '90%',
    height: '40%',

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
    forgotContainer: {
    width: '100%',
    alignItems: 'flex-end',
    },  
    forgotText: {
    color: '#EC6337',
    fontSize: 12,
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
    marginTop: 20,
    },
    loginText: {
    textAlign: 'center',
    color: '#FFFFFF',
    },
    signUpText: {
    color: '#EC6337',
    },
});