import React, { useState, useEffect} from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import RecalculateModal from '@/components/Modals/recalculateModal.js';
import {firebaseApp, firebaseAuth, firebaseDb} from '../../firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDoc, onSnapshot, doc, getDocs, updateDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { ForceTouchGestureHandler } from 'react-native-gesture-handler';
import MacroCalculator from '@/components/GoalsComponent/MacroCalculator.js';

/*

() => 
  <MacroCalculator 
    gender={gender}
    age={age}
    height={height}
    weight={weight}
    activeness={activeness}
    weightGoal={weightGoal}
    setCalories={setCalories}
    setProtein={setProtein}
    setCarbohydrates={setCarbohydrates}
    setFat={setFat}
  />

*/

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

  const [calories, setCalories] = React.useState(0);
  const [carbohydrates, setCarbohydrates] = React.useState(0);
  const [protein, setProtein] = React.useState(0);
  const [fat, setFat] = React.useState(0);

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
          //console.log('Successfully found goalsArray (fetchGoalsData): ' + goalsArray);

          setGender(goalsArray[0]);
          setAge(goalsArray[1]);
          setHeight(goalsArray[2]);
          setWeight(goalsArray[3]);
          setActiveness(goalsArray[4]);
          setWeightGoal(goalsArray[5]);

          const macroGoalsArray = docSnap.data().macroGoals;

          setCalories(macroGoalsArray[0]);
          setCarbohydrates(macroGoalsArray[1]);
          setProtein(macroGoalsArray[2]);
          setFat(macroGoalsArray[3]);

        }

      }

      catch (error) {
        //console.error("Error occured when fetching data " + error)
      }
    }

    fetchGoalsData();

  }, []);

  const updateMacroGoalsFunction = async (newArray) => {

    console.log("In the update macro goals function!")

    try {     

      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        console.log("inside the if statement")
        // const macroGoalsArray = docSnap.data().macroGoals;
        // console.log('Successfully found goalsArray (updatGoalsFunction): ' + macroGoalsArray);

        await updateDoc(docRef, {
          macroGoals : newArray
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


  const updateGoalsFunction = async (goalDetail, newValue) => {

    //console.log('in update goals function');

    const genderAccessor = 0;
    const ageAccessor = 1;
    const heightAccessor = 2;
    const weightAccessor = 3;
    const activenessAccessor = 4;
    const weightGoalAccessor = 5;

    const detailAccessorSelector = () => {
      switch (goalDetail) {
        case 'gender':
          //console.log('Gender Accessor: ' + gender);
          return genderAccessor;
        case 'age':
          //console.log('Age Accessor: ' + age);
          return ageAccessor;
        case 'height':
          //console.log('Height Accessor: ' + height);
          return heightAccessor;
        case 'weight':
          //console.log('Weight Accessor: ' + weight);
          return weightAccessor;
        case 'activeness':
          //console.log('Activeness Accessor: ' + activeness);
          return activenessAccessor;
        case 'weight goal':
          //console.log('Weight Goal Accessor: ' + weightGoal);
          return weightGoalAccessor;
        default:
          //console.log('No Such Detail Type!');
      }
    }

    try {     

      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const goalsArray = docSnap.data().goals;
        //.log('Successfully found goalsArray (updatGoalsFunction): ' + goalsArray);

        const accessorIndex = detailAccessorSelector();

        const updatedGoals = [...goalsArray];
        updatedGoals[accessorIndex] = String(newValue)

        await updateDoc(docRef, {
          goals : updatedGoals
        });

      } else {
        //console.log("No such document!");
        return null;
      }
    
    }
    catch (error) {
      //console.error("Error: " + error);
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
    setCurrentDetail(detail);
    setModalType(type);
    setWarningModalVisible(true);
  };


  const MacroCalculator = () => {

    let newAge = Number(age)
    let newHeight = Number(height)
    let newWeight = Number(weight)

    let calculatedMBR;
    let rciActive;
    let finalRCI;
    let calculatedProtein;
    let calculatedCarbo;
    let calculatedFat;
  
    function calMBR() {
      if (gender === 'Male') {
        calculatedMBR = 13.397*newWeight + 4.799*newHeight - 5.677*newAge + 88.362
      } else if (gender === 'Female') { 
        calculatedMBR = 9.247*newWeight + 3.098*newHeight- 4.330*newAge + 447.593
      } 

      //console.log(calculatedMBR)
    }
  
    function calRCIActive() {
      calMBR()
      switch(activeness) {
      case 'Sedentary': 
        rciActive = calculatedMBR * 1.15;
        break;
      
      case 'Light': 
        rciActive = calculatedMBR * 1.35;
        break;
  
      case 'Moderate': 
        rciActive = calculatedMBR * 1.45;
        break;
  
      case 'Heavy': 
        rciActive = calculatedMBR * 1.55;
        break;
  
      case 'Intense': 
        rciActive = calculatedMBR * 1.7;
        break;
  
      default: 
        rciActive = calculatedMBR;
        break;
      }

      //console.log(rciActive)
    }
  
    function calFinalRCI() {
      calRCIActive();
      switch(weightGoal) {
      case 'Weight Gain': 
        finalRCI = rciActive * 1.2;
        break;
      
      case 'Mild Weight Gain': 
        finalRCI = rciActive * 1.1;
        break;
  
      case 'Maintain Weight': 
        finalRCI = rciActive;
        break;
  
      case 'Mild Weight Loss': 
        finalRCI = rciActive * 0.9;
        break;
  
      case 'Weight Loss': 
        finalRCI = rciActive * 0.8;
        break;
      }

      //console.log(finalRCI)
    }
  
    function calMacros(finalRCI){
      calculatedProtein = (0.15 * finalRCI) / 4;
      calculatedCarbo = (0.65 * finalRCI) / 4;
      calculatedFat = (0.2 * finalRCI) / 9;
    }
  
    calFinalRCI();
    calMacros(finalRCI);
    // console.log(finalRCI)
    // console.log(calculatedProtein)
    // console.log(calculatedCarbo)
    // console.log(calculatedFat)
  
    setCalories(Math.round(finalRCI));
    setProtein(Math.round(calculatedProtein));
    setCarbohydrates(Math.round(calculatedCarbo));
    setFat(Math.round(calculatedFat));

    console.log(calories)
    console.log(carbohydrates)
    console.log(protein)
    console.log(fat)

    const newMacroGoalArray = [calories, carbohydrates, protein, fat];
    
    updateMacroGoalsFunction(newMacroGoalArray);
  
  }




  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          {/* //age, height, weight, activeness, setCalories, setProtein, setCarbohydrates, setFat, weightGoal */}
        <View style={styles.calMacroButtonContainer}>
          <TouchableOpacity style={styles.calMacroButton} onPress={() => MacroCalculator()}>
            <Text style={styles.calMacroText}> Calculate Macros! </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calculatedMarcoContainer}>
          <View style={styles.macroDetailContainer}>
            <Text style={styles.macroDetailText}>Recommended Calorie intake: {calories}</Text>
          </View>

          <View style={styles.macroDetailContainer}>
            <Text style={styles.macroDetailText}>Recommended Carbohydrates intake: {carbohydrates}g</Text>
          </View>

          <View style={styles.macroDetailContainer}>
            <Text style={styles.macroDetailText}>Recommended Protein intake: {protein}g</Text>
          </View>

          <View style={styles.macroDetailContainer}> 
            <Text style={styles.macroDetailText}>Recommended Fat intake: {fat}g</Text>
          </View>

        </View>
    </ScrollView>
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
  calMacroButtonContainer: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  calMacroButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 175,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#EC6337',
  },
  calMacroText: {
    fontSize: 16,
    fontWeight: 'bold',
    
  },





  calculatedMarcoContainer: {
    flex: 0.4,
    padding: 15,
  },
  macroDetailContainer: {
    flex: 0.25,
  },
  macroDetailText: {
    fontSize: 18,
  }
});