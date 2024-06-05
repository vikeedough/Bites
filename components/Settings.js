import React from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import {firebaseApp, firebaseAuth} from '../firebaseConfig'

const app = firebaseApp
const auth = firebaseAuth

export default function Settings() {
  const user = auth.currentUser
  const [image, setImage] = React.useState(null)
  const addImage = () => {}
  return (

    <ScrollView contentContainerStyle={{flexGrow: 1}}>

        <View style={styles.imageContainer}>
            {
                image  && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
            }
                <View style={styles.uploadBtnContainer}>
                    <TouchableOpacity onPress={addImage} style={styles.uploadBtn} >
                        <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                        <AntDesign name="camera" size={20} color="black" />
                    </TouchableOpacity>
                </View>
        </View>

        <Text style={{fontWeight: 'bold', fontSize: 30, textAlign: 'center'}}> Welcome, {user.displayName}! </Text>

        <View style={styles.ButtonContainer}>
            <TouchableOpacity>
                <Text style={styles.ButtonText}>Profile</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.ButtonContainer}>
            <TouchableOpacity>
                <Text style={styles.ButtonText}>Goals</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.ButtonContainer}>
            <TouchableOpacity>
                <Text style={styles.ButtonText}>Progress</Text>
            </TouchableOpacity>
        </View>
        
        <View style={styles.ButtonContainer}>
            <TouchableOpacity onPress = {() => auth.signOut()}>
                <Text style={styles.ButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  ButtonContainer: {
    flex: 0.08,
    justifyContent: 'center',
    alignItems: 'left'
  },
  ButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 20
  },
  container: { 
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loginText: {
    fontWeight: 'bold',
    fontSize: 30,
    margin: 10,
  },
  input: {
    borderWidth: 0,
    margin: 5,
    width: 150,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  imageContainer:{
    flex: 0.005,
    margin: 10,
    elevation:2,
    height:125,
    width:125,
    backgroundColor:'#efefef',
    alignSelf: 'center',
    borderRadius:999,
    overflow:'hidden',
  },
  uploadBtnContainer:{
    opacity:0.7,
    position:'absolute',
    right:0,
    bottom:0,
    backgroundColor:'lightgrey',
    width:'100%',
    height:'25%',
  },
uploadBtn:{
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
})