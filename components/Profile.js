import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import React, {useState, useEffect} from 'react';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseAuth, firebaseApp, firebaseDb } from '@/firebaseConfig';
import { useIsFocused } from '@react-navigation/native';

const app = firebaseApp
const auth = firebaseAuth
const db = firebaseDb

export default function Profile({navigation}) {

  const isFocused = useIsFocused();
  let user = auth.currentUser;
  const [userSnap, setUserSnap] = useState(null);
  const [vegeEnabled, setVegeEnabled] = useState(false);

  useEffect(() => {

    const fetchUserSnap = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            setUserSnap(snap.data());
          } else {
            console.log("No such document!");
            setUserSnap(null);
          }
        }
      } catch (error) {
        console.error("Error fetching user document:", error);
        setUserSnap(null);
      } finally {
      }
    };

    if (isFocused) {
      user = auth.currentUser;
      fetchUserSnap();
    }
    
  }, [isFocused]);

  useEffect(() => {
    if (userSnap !== null) {
      setVegeEnabled(userSnap.vegetarian);
    }
  }, [userSnap]);

  const toggleVege = () => {
    setVegeEnabled(!vegeEnabled);
    setDoc(doc(db, "users", auth.currentUser.uid), 
        { vegetarian: !vegeEnabled }, { merge: true}
    )
  }
  return (
    <ScrollView style={{flexGrow: 1, backgroundColor: '#F4F4F6'}}>

      <TouchableOpacity onPress={() => navigation.navigate('Change Username')}>
      <View style={styles.boxContainer}>
          <View style={styles.titleBox}>
            <View style={{flex: 1, alignSelf: 'flex-start'}}> 
              <Text style={{fontWeight: 'bold', fontSize: 18}}>Username</Text>
            </View>
            
            <View> 
              <Text style={{fontStyle: 'italic', fontSize: 18}}>{user.displayName}</Text>
            </View>
          </View>
      </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Change Email')}>
      <View style={styles.boxContainer}>
        
          <View style={styles.titleBox}>
            <View style={{flex: 1, alignSelf: 'flex-start'}}> 
              <Text style={{fontWeight: 'bold', fontSize: 18}}>Email</Text>
            </View>
            
            <View> 
              <Text style={{fontStyle: 'italic', fontSize: 18}}>{user.email}</Text>
            </View>
          </View>
      </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Reset Password')}>
      <View style={styles.boxContainer}>
          <View style={styles.titleBox}>
            <View style={{flex: 1, alignSelf: 'flex-start'}}> 
              <Text style={{fontWeight: 'bold', fontSize: 18}}>Reset Password</Text>
            </View>
          </View>
      </View>
      </TouchableOpacity>

      <View style={styles.boxContainer}>
          <View style={styles.titleBox}>
            <View style={{flex: 1, alignSelf: 'flex-start', textAlignVertical: 'center', paddingTop: 15}}> 
              <Text style={{fontWeight: 'bold', fontSize: 18}}>Vegetarian</Text>
            </View>

            <View> 
              <Switch
                trackColor={{false: '#767577', true: '#ff924a'}}
                thumbColor={vegeEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleVege}
                value={vegeEnabled}
              />
            </View>
          </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 20,
    paddingVertical: 30,
    justifyContent: 'center',
    textAlignVertical: 'center'
  },
  titleBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  }
});
