import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { firebaseApp, firebaseAuth, firebaseDb } from '../firebaseConfig';
import { getStorage, ref, uploadBytes, getBytes, getDownloadURL, uploadString } from "firebase/storage";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { updateProfile, onAuthStateChanged } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import Profile from '@/components/Profile.js';
import Goals from '@/components/Goals.js';
import Progress from '@/components/Progress.js';
import ProfileNavigator from '@/components/navigation/ProfileNavigator.js'
import { useIsFocused } from '@react-navigation/native';


const app = firebaseApp
const auth = firebaseAuth
const db = firebaseDb

const storage = getStorage()

export default function Settings({navigation}) {

  const isFocused = useIsFocused();
  let user = auth.currentUser;

  useEffect(() => {
    if (isFocused) {
      user = auth.currentUser;
    }
  }, [isFocused]);

  const [image, setImage] = React.useState(user.photoURL === null ? null : user.photoURL)

  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const addImage = async () => {
    let profilePic = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1],
      quality: 1,
    });
    const blob = await uriToBlob(profilePic.assets[0].uri)
    let imageRef = ref(storage, user.uid + '/profilePic/profile.jpeg')
    await uploadBytes(imageRef, blob).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
    let url = await getDownloadURL(imageRef)
    updateProfile(user, { photoURL: url })
    await setDoc(doc(db, "users", auth.currentUser.uid), 
        { profilePic: url }, { merge: true}
    )
    if (!profilePic.canceled) {
      setImage(url);
    }
  }

  return (

    <ScrollView contentContainerStyle={{flexGrow: 1}}>

        <View style={styles.imageContainer}>
            {
                image  && <Image source={{ uri: image }} style={{ width: 125, height: 125 }} />
            }
                <View style={styles.uploadBtnContainer}>
                    <TouchableOpacity onPress={addImage} style={styles.uploadBtn} >
                        <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                        <AntDesign name="camera" size={20} color="black" />
                    </TouchableOpacity>
                </View>
        </View>

        <Text style={{fontWeight: 'bold', fontSize: 30, textAlign: 'center'}}> Welcome, {user.displayName}! </Text>
        
        <View style={{justifyContent: 'space-evenly', flex: 1}}>

        <View style={styles.ButtonContainer}>
            <TouchableOpacity onPress={()=> navigation.navigate("ProfileNavigator")}>
                <Text style={styles.ButtonText}>Profile</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.ButtonContainer}>
            <TouchableOpacity onPress={()=> navigation.navigate("FriendsNavigator")}>
                <Text style={styles.ButtonText}>Friends</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.ButtonContainer}>
            <TouchableOpacity onPress={()=> navigation.navigate(Goals)}>
                <Text style={styles.ButtonText}>Goals</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.ButtonContainer}>
            <TouchableOpacity onPress={()=> navigation.navigate(Progress)}>
                <Text style={styles.ButtonText}>Progress</Text>
            </TouchableOpacity>
        </View>
        
        <View style={styles.ButtonContainer}>
            <TouchableOpacity onPress = {() => auth.signOut()}>
                <Text style={styles.ButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>

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
    margin: 10,
    elevation:2,
    height:125,
    width:125,
    backgroundColor:'#efefef',
    position: 'relative',
    alignSelf: 'center',
    borderRadius:999,
    borderColor: '#ff924a',
    borderWidth: 3,
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