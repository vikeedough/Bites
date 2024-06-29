import React, { useState, useEffect} from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import RecalculateModal from '@/components/Modals/recalculateModal.js';
import {firebaseApp, firebaseAuth, firebaseDb} from '../firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDoc, onSnapshot, doc, getDocs, updateDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;

export default function Goals() {

  const [gender, setGender] = React.useState('');
  const [age, setAge] = React.useState('');
  const [height, setHeight] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [activeness, setActiveness] = React.useState('');
  const [weightGoal, setWeightGoal] = React.useState('');

  const [warningModalVisibile, setWarningModalVisible] = useState(false);
  const [goalsNumberModalVisibile, setGoalsNumberModalVisible] = useState(false);
  const [goalsDropdownModalVisibile, setGoalsDropdownModalVisible] = useState(false);
  const [currentDetail, setCurrentDetail] = useState('');
  const [modalType, setModalType] = useState('');

  const [loading, setLoading] = useState(true)

  useEffect(()=> {

    const fetchGoalsData = async () => {
      
      try {
        
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const goalsArray = docSnap.data().goals;
          console.log('Successfully found goalsArray (fetchGoalsData): ' + goalsArray);

          setGender(goalsArray[0]);
          setAge(goalsArray[1]);
          setHeight(goalsArray[2]);
          setWeight(goalsArray[3]);
          setActiveness(goalsArray[4]);
          setWeightGoal(goalsArray[5]);
        }

      }

      catch (error) {
        console.error("Error occured when fetching data " + error)
      }
    }

    fetchGoalsData();

  }, []);


  const updateGoalsFunction = async (goalDetail, newValue) => {

    console.log('in update goals function');

    const genderAccessor = 0;
    const ageAccessor = 1;
    const heightAccessor = 2;
    const weightAccessor = 3;
    const activenessAccessor = 4;
    const weightGoalAccessor = 5;

    const detailAccessorSelector = () => {
      switch (goalDetail) {
        case 'gender':
          console.log('Gender Accessor: ' + gender);
          return genderAccessor;
        case 'age':
          console.log('Age Accessor: ' + age);
          return ageAccessor;
        case 'height':
          console.log('Height Accessor: ' + height);
          return heightAccessor;
        case 'weight':
          console.log('Weight Accessor: ' + weight);
          return weightAccessor;
        case 'activeness':
            console.log('Activeness Accessor: ' + activeness);
            return activenessAccessor;
        case 'weight goal':
            console.log('Weight Goal Accessor: ' + weightGoal);
            return weightGoalAccessor;
        default:
            console.log('No Such Detail Type!');
      }
    }

    try {     

      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const goalsArray = docSnap.data().goals;
        console.log('Successfully found goalsArray (updatGoalsFunction): ' + goalsArray);

        const accessorIndex = detailAccessorSelector();

        const updatedGoals = [...goalsArray];
        updatedGoals[accessorIndex] = String(newValue)

        await updateDoc(docRef, {
          goals : updatedGoals
        });

      } else {
        console.log("No such document!");
        return null;
      }
    
    }
    catch (error) {
      console.error("Error: " + error);
      throw error;
    }

  }

  function updateDetail(newDetail) {
    if (currentDetail === 'age') {
      setAge(newDetail);
    } else if (currentDetail === 'height') {
      setHeight(newDetail);
    } else if (currentDetail === 'weight') {
      setWeight(newDetail);
    } else if (currentDetail === 'gender') {
      setGender(newDetail);
    } else if (currentDetail === 'activeness') {
      setActiveness(newDetail);
    } else if (currentDetail === 'weight goal') {
      setWeightGoal(newDetail);
    }
  };

  const openDetailModal = (detail, type) => {
    setCurrentDetail(detail)
    setModalType(type)
    setWarningModalVisible(true);
  };

  return (
    <View style={styles.container}>
        <RecalculateModal 
          recalVisible={warningModalVisibile}
          setRecalVisible={setWarningModalVisible} 
          goalsNumberModalVisible={goalsNumberModalVisibile}
          setGoalsNumberModalVisible={setGoalsNumberModalVisible}
          goalsDropdownModalVisible={goalsDropdownModalVisibile}
          setGoalsDropdownModalVisible={setGoalsDropdownModalVisible}
          updateDetail={updateDetail}
          detailType={currentDetail}
          modalType={modalType}
          updateGoalsFunction={updateGoalsFunction}/>

        <View style={styles.detailContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textLayout}>Gender</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => openDetailModal('gender', 'dropdown')}>
              <Text style={styles.buttonText}>{gender || 'Select Gender'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textLayout}>Age</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => openDetailModal('age', 'number')}>
              <Text style={styles.buttonText}>{age ? `${age} years old` : 'Enter Age'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.detailContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textLayout}>Height</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => openDetailModal('height', 'number')}>
              <Text style={styles.buttonText}>{height ? `${height} cm` : 'Enter Height'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textLayout}>Weight</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => openDetailModal('weight', 'number')}>
              <Text style={styles.buttonText}>{weight ? `${weight} kg` : 'Enter Weight'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.textLayout}>Activeness</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => openDetailModal('activeness', 'dropdown')}>
                <Text style={styles.buttonText}>{activeness || 'Select Activeness'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.textLayout}>Weight Goal</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => openDetailModal('weight goal', 'dropdown')}>
                <Text style={styles.buttonText}>{weightGoal || 'Select Weight Goal'}</Text>
              </TouchableOpacity>
            </View>
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: 'red'
  },
  detailContainer: {
    flex: 0.1,
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'center',
    borderBottomWidth: 0.5
    //backgroundColor: 'red'
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  textInput: {
    padding: 10,
    width: 40
  },
  textLayout: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonText: {
    fontSize: 18,
    color: '#ff924a'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: 300,
    height: 125,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
});