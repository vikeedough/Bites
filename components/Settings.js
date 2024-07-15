import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { firebaseApp, firebaseAuth, firebaseDb } from '../firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import Goals from '@/components/GoalsComponent/Goals.js';
import Achievements from '@/components/AchievementComponent/Achievements.js';
import { useIsFocused } from '@react-navigation/native';

const auth = firebaseAuth;
const db = firebaseDb;
const placeholder = require('@/assets/images/placeholder.png');

const storage = getStorage();

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

    <View style={styles.container}>
      
      <View style={styles.cardContainer}>

        <View style={styles.imageContainer}>
            {
                image  && <Image source={ image === null ? placeholder : { uri: image }} style={{ width: 125, height: 125 }} />
            }
                <View style={styles.uploadBtnContainer}>
                    <TouchableOpacity onPress={addImage} style={styles.uploadBtn} >
                        <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                        <AntDesign name="camera" size={20} color="black" />
                    </TouchableOpacity>
                </View>
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.usernameText}> Welcome, {user.displayName}! </Text>
        </View>
        
      </View>

      <View style={styles.bottomContainer}>

          <TouchableOpacity onPress={()=> navigation.navigate("ProfileNavigator")}>
            <View style={styles.ButtonContainer}>
                <AntDesign.Button name="user" backgroundColor="#FFFFFF" 
                color= '#EC6337' size = {20} style={{paddingEnd: 0, paddingLeft: 15}}>
                </AntDesign.Button>
                <Text style={styles.ButtonText}>Profile</Text>
            </View>
          </TouchableOpacity>
        

        
          <TouchableOpacity onPress={()=> navigation.navigate("FriendsNavigator")}>
            <View style={styles.ButtonContainer}>
                <AntDesign.Button name="team" backgroundColor="#FFFFFF" 
                color= '#EC6337' size = {20} style={{paddingEnd: 0, paddingLeft: 15}}>
                </AntDesign.Button>
                <Text style={styles.ButtonText}>Friends</Text>
            </View>
          </TouchableOpacity>
        

        
          <TouchableOpacity onPress={()=> navigation.navigate(Goals)}>
            <View style={styles.ButtonContainer}>
                <AntDesign.Button name="rocket1" backgroundColor="#FFFFFF" 
                color= '#EC6337' size = {20} style={{paddingEnd: 0, paddingLeft: 15}}>
                </AntDesign.Button>
                <Text style={styles.ButtonText}>Goals</Text>
              </View>
          </TouchableOpacity>
        

        
          <TouchableOpacity onPress={()=> navigation.navigate(Achievements)}>
            <View style={styles.ButtonContainer}>
                <AntDesign.Button name="Trophy" backgroundColor="#FFFFFF" 
                color= '#EC6337' size = {20} style={{paddingEnd: 0, paddingLeft: 15}}>
                </AntDesign.Button>
                <Text style={styles.ButtonText}>Achievements</Text>
              </View>
          </TouchableOpacity>
        
        
        
          <TouchableOpacity onPress = {() => auth.signOut()}>
            <View style={styles.ButtonContainer}>
                <AntDesign.Button name="poweroff" backgroundColor="#FFFFFF" 
                color= '#EC6337' size = {20} style={{paddingEnd: 0, paddingLeft: 15}}>
                </AntDesign.Button>
                <Text style={styles.ButtonText}>Logout</Text>
              </View>
          </TouchableOpacity>
        

      </View>

    </View>
    );
}

const styles = StyleSheet.create({
  bottomContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    height: '70%',
    backgroundColor: '#F4F4F6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 25,
    paddingBottom: 40,
  },
  ButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  ButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 20,
    height: '30%',
  },
  container: { 
    display: 'flex',
    backgroundColor: 'white',
  },
  welcomeContainer: {
    display: 'flex',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameText: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
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
    borderColor: '#EC6337',
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