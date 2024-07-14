import { useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { firebaseAuth } from '../firebaseConfig';
import Goals from '@/components/GoalsComponent/Goals.js';
import Progress from '@/components/Progress.js';
import { useIsFocused } from '@react-navigation/native';

const auth = firebaseAuth;

export default function Settings({navigation}) {

  const isFocused = useIsFocused();
  let user = auth.currentUser;

  useEffect(() => {
    if (isFocused) {
      user = auth.currentUser;
    }
  }, [isFocused]);

  const signOut = async () => {
    Alert.alert(
        "Log out",
        "Are you sure you want to log out of your account?",
        [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Log Out",
                onPress: async () => {
                    auth.signOut()
                },
                style: "destructive"
            }
        ]
    )
}

  return (

    <View style={styles.container}>

      <View style={styles.bottomContainer}>

          <TouchableOpacity onPress={()=> navigation.navigate("ProfileNavigator")}>
            <View style={styles.ButtonContainer}>
                <AntDesign.Button name="user" backgroundColor="#FFFFFF" 
                color= '#EC6337' size = {20} style={{paddingEnd: 0, paddingLeft: 15}}>
                </AntDesign.Button>
                <Text style={styles.ButtonText}>Account</Text>
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
        

        
          <TouchableOpacity onPress={()=> navigation.navigate(Progress)}>
            <View style={styles.ButtonContainer}>
                <AntDesign.Button name="Trophy" backgroundColor="#FFFFFF" 
                color= '#EC6337' size = {20} style={{paddingEnd: 0, paddingLeft: 15}}>
                </AntDesign.Button>
                <Text style={styles.ButtonText}>Achievements</Text>
              </View>
          </TouchableOpacity>
        
        
        
          <TouchableOpacity onPress = {signOut}>
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
    gap: 15,
    height: '100%',
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
  container: { 
    display: 'flex',
    backgroundColor: 'white',
    height: '100%',
  },
  input: {
    borderWidth: 0,
    margin: 5,
    width: 150,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
})