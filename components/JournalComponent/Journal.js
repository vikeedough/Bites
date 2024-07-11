import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import Food from "@/components/JournalComponent/Food.js"
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CalendarModal from '@/components/JournalComponent/CalendarModal.js';
import {firebaseApp, firebaseAuth, firebaseDb} from '../../firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDoc, onSnapshot, doc, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import DeleteEntryModal from "@/components/JournalComponent/DeleteEntryModal.js";
import { useFocusEffect } from '@react-navigation/native';
import { ref } from 'firebase/storage';
import { setEnabled } from 'react-native/Libraries/Performance/Systrace';

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;

export default function Journal({navigation}) {

  const todayDateStringID = new Date().toISOString().split('T')[0];

  const [calendarModal, setCalendarModal] = useState(false);
  const [selectedDayID, setSelectedDayID] = useState('');
  const [currentFoodEntry, setCurrentFoodEntry] = useState('');
  const [dateLabel, setDateLabel] = useState('Today');
  const [deleteEntryModal, setDeleteEntryModal] = useState(false);

  const [breakfast, setBreakfast] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [dinner, setDinner] = useState([]);
  const [others, setOthers] = useState([]);

  const checkAndCreateEntry = async (date) => {

    console.log("In Check and Create!")

    try {

      const docRef = doc(db, 'users', auth.currentUser.uid);
      const foodLogCollectionRef = collection(docRef, 'FoodLog');
      const foodEntryDocRef = doc(foodLogCollectionRef, date);
      const foodEntry = await getDoc(foodEntryDocRef);

      if (!foodEntry.exists()) {

        console.log("Creating a new foodlog...")

        const newFoodEntry = { 
          date, 
          breakfast: [],
          lunch: [],
          dinner: [],
          others: [],
          totalCalories: 0,
          totalCarbohydrates: 0,
          totalProtein: 0,
          totalFat: 0  
        }

        await setDoc(foodEntryDocRef, newFoodEntry)
        setCurrentFoodEntry(newFoodEntry)

        console.log("Done creating new foodlog...")
      }

      else {
        setCurrentFoodEntry(foodEntry.data())
      }

    }

    catch (error) {
      console.error("Error occured when fetching data " + error)
    }
  };

  
  const deleteEntry = async (mealType, foodName) => {

    const date = selectedDayID ? selectedDayID : todayDateStringID 
    console.log("In Delete entry")
    console.log(mealType)
    console.log(foodName)

    try {

      const docRef = doc(db, 'users', auth.currentUser.uid);
      const foodLogCollectionRef = collection(docRef, 'FoodLog');
      const foodEntryDocRef = doc(foodLogCollectionRef, date);
      const foodEntry = await getDoc(foodEntryDocRef);

      if (foodEntry.exists()) {
        const foodLogArray = foodEntry.data()[mealType];
        const newFoodLogArray = [...foodLogArray];
        //console.log(newFoodLogArray)
        const foodToRemove = newFoodLogArray.findIndex(food => food.foodName === foodName);
        //console.log(foodToRemove)

        if (foodToRemove !== -1) {
          newFoodLogArray.splice(foodToRemove, 1);
        }

        await updateDoc(foodEntryDocRef, {
          [mealType] : newFoodLogArray
        });
      }

      else {
        console.log("Unable to find food Entry! In Food Page")
      }

    }

    catch (error) {
      console.error("Error occured when fetching data " + error)
    }
  }

  //When Journal page is first mounted
  useEffect(() => {

    console.log("In Use Effect when Journal mounts or when date selected changes")

    const fetchData = async () => {

      const date = selectedDayID ? selectedDayID : todayDateStringID  
      //console.log(date);

      await checkAndCreateEntry(date);

      try {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const foodLogCollectionRef = collection(docRef, 'FoodLog');
        const foodEntryDocRef = doc(foodLogCollectionRef, date);

        //console.log(foodEntryDocRef);

        const unsubscribe = onSnapshot(foodEntryDocRef, (doc) => {
          const breakfast = doc.data().breakfast;
          const lunch = doc.data().lunch;
          const dinner = doc.data().dinner;
          const others = doc.data().others;
          
          // console.log(breakfast)
          // console.log(lunch)
          // console.log(dinner)
          // console.log(others)

          setBreakfast(breakfast)
          setLunch(lunch)
          setDinner(dinner)
          setOthers(others)

        });

        return () => {
          unsubscribe();
        };
      }

        catch (error) {
          console.error("Error occured when fetching data " + error)
        }
    }

    fetchData();

  }, [selectedDayID])

  const openCalendarModal = () => {
    setCalendarModal(true);
  }

  const onDayPress = (newDay) => {
    const newDate = new Date(newDay.dateString);
    const newDateID = newDate.toISOString().split('T')[0];

    checkAndCreateEntry(newDateID);

    calendarLabel(newDateID);

    setSelectedDayID(newDateID);

    setCalendarModal(false);
  }

  const calendarLabel = (newDay) => {
    if (newDay === todayDateStringID) {
      setDateLabel("Today");
    } else {
      setDateLabel(String(newDay));
    }
  }  

  const navigateToAddFood = () => {
    //console.log("In Journal Page " + currentFoodEntry);
    navigation.navigate('Food', { currentFoodEntry });
  }

  const updateDisplay = (foodArray, mealType) => {

    return foodArray.map((food, index) => (
      <View key={index} style={styles.mealDisplayContainer}>

        <DeleteEntryModal
          deleteEntryModal={deleteEntryModal}
          setDeleteEntryModal={setDeleteEntryModal}
          deleteEntry={deleteEntry}
          deleteEntryMealType={mealType}
          deleteEntryFood={food.foodName} />

        <View style={styles.foodNameContainer}>
          <TouchableOpacity delayLongPress={500} onLongPress={() => setDeleteEntryModal(true)}>
            <View style={styles.innerFoodNameContainer}>
              <Text style={styles.mealDisplayTitle}>{food.foodName}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.foodCaloriesContainer}>
          <View style={styles.innerFoodCaloriesContainer}>
            <Text style={styles.calorieDisplayText}>{food.calories}</Text>
          </View>
        </View>

      </View>
    ))

  }

  const calorieEquation = () => {
    const totalBfastCalories = breakfast.reduce((total, item) => total + item.calories, 0);
    const totalLunchCalories = lunch.reduce((total, item) => total + item.calories, 0);
    const totalDinnerCalories = dinner.reduce((total, item) => total + item.calories, 0);
    const totalOthersCalories = others.reduce((total, item) => total + item.calories, 0);
    const totalCalories = totalBfastCalories + totalLunchCalories + totalDinnerCalories + totalOthersCalories;

    return (
      <View style={styles.calorieEquationContainer}>
        <View style={styles.totalCaloriesContainer}>
          <Text style={styles.calculatedCaloriesText}>{totalCalories}</Text>
          <Text style={styles.mealCaloriesText}>Total Calories</Text>
        </View>
        <View style={styles.addedMacrosContainer}>
          
          <View style={styles.individualMacroContainer}>
            <Text style={styles.individualCaloriesText}>{totalBfastCalories}</Text>
            <Text style={styles.mealCaloriesText}>Breakfast</Text>
          </View>

          <View style={styles.individualMacroContainer}>
            <Text style={styles.individualCaloriesText}>{totalLunchCalories}</Text>
            <Text style={styles.mealCaloriesText}>Lunch</Text>
          </View>

          <View style={styles.individualMacroContainer}>
            <Text style={styles.individualCaloriesText}>{totalDinnerCalories}</Text>
            <Text style={styles.mealCaloriesText}>Dinner</Text>
          </View>

          <View style={styles.individualMacroContainer}>
            <Text style={styles.individualCaloriesText}>{totalOthersCalories}</Text>
            <Text style={styles.mealCaloriesText}>Others</Text>
          </View>

        </View>
      </View>
      
    )

  }

  return (
    <View style={styles.container}>

      <CalendarModal
        calendarModal={calendarModal}
        setCalendarModal={setCalendarModal}
        onDayPress={onDayPress} />

      <View style={styles.todayContainer}>
          <Text style={styles.todayText}>{dateLabel}</Text>
          <TouchableOpacity style={styles.calendarIcon} onPress={() => openCalendarModal()}>
            <Ionicons name="calendar" color={'#EC6337'} size={24} />
          </TouchableOpacity>
      </View>

      <View style={styles.barGraphContainer}>
        {calorieEquation()}
      </View>

      <View style={styles.BodyContainer}>

        <View style={styles.foodDiaryContainer}>
          <Text style={styles.foodDiaryText}>Food Diary</Text>
        </View>

        <ScrollView contentContainerStyle={{flexGrow: 1}} style={styles.scrollViewContainer}>

            <View style ={styles.MealContainer}>
              <View style={styles.mealLeftContainer}>
                <MaterialCommunityIcons 
                  name='food-apple-outline' 
                  color='#EC6337'
                  size={20}
                  style={{paddingEnd: 0}}
                />
              </View>
              <View style={styles.mealRightContainer}>
                <View style={styles.MealHeader}>
                  <View style={styles.mealLeftHeader}>
                    <Text style={styles.MealTitle}>Breakfast</Text>
                  </View>
                  <View style={styles.mealRightHeader}>
                    <Text style={styles.CalorieTitle}>{breakfast.reduce((total, item) => total + item.calories, 0)} Calories</Text>
                  </View>
                </View>
                <View style={styles.arrayMapContainer}>
                  <ScrollView>
                    {updateDisplay(breakfast, 'breakfast')}
                  </ScrollView>
                </View>
              </View>
            </View>

            <View style ={styles.MealContainer}>
              <View style={styles.mealLeftContainer}>
                <MaterialCommunityIcons 
                  name='food-outline' 
                  color='#EC6337'
                  size={20}
                  style={{paddingEnd: 0}}
                />
              </View>
              <View style={styles.mealRightContainer}>
                <View style={styles.MealHeader}>
                  <View style={styles.mealLeftHeader}>
                    <Text style={styles.MealTitle}>Lunch</Text>
                  </View>
                  <View style={styles.mealRightHeader}>
                    <Text style={styles.CalorieTitle}>{lunch.reduce((total, item) => total + item.calories, 0)} Calories</Text>
                  </View>
                </View>
                <View style={styles.arrayMapContainer}>
                  <ScrollView>
                    {updateDisplay(lunch, 'lunch')}
                  </ScrollView>
                </View>
              </View>
            </View>

            <View style ={styles.MealContainer}>
              <View style={styles.mealLeftContainer}>
                <MaterialCommunityIcons 
                  name='food-drumstick-outline' 
                  color='#EC6337'
                  size={20}
                  style={{paddingEnd: 0}}
                />
              </View>
              <View style={styles.mealRightContainer}>
                <View style={styles.MealHeader}>
                  <View style={styles.mealLeftHeader}>
                    <Text style={styles.MealTitle}>Dinner</Text>
                  </View>
                  <View style={styles.mealRightHeader}>
                    <Text style={styles.CalorieTitle}>{dinner.reduce((total, item) => total + item.calories, 0)} Calories</Text>
                  </View>
                </View>
                <View style={styles.arrayMapContainer}>
                  <ScrollView>
                    {updateDisplay(dinner, 'dinner')}
                  </ScrollView>
                </View>
              </View>
            </View>

            <View style ={styles.MealContainer}>
              <View style={styles.mealLeftContainer}>
                <MaterialCommunityIcons 
                  name='food-hot-dog' 
                  color='#EC6337'
                  size={20}
                  style={{paddingEnd: 0}}
                />
              </View>
              <View style={styles.mealRightContainer}>
                <View style={styles.MealHeader}>
                  <View style={styles.mealLeftHeader}>
                    <Text style={styles.MealTitle}>Others</Text>
                  </View>
                  <View style={styles.mealRightHeader}>
                    <Text style={styles.CalorieTitle}>{others.reduce((total, item) => total + item.calories, 0)} Calories</Text>
                  </View>
                </View>
                <View style={styles.arrayMapContainer}>
                  <ScrollView>
                    {updateDisplay(others, 'others')}
                  </ScrollView>
                </View>
              </View>
            </View>
        </ScrollView>
        
      </View>

      <View style={styles.ButtonContainer}>
        <TouchableOpacity style={styles.AddFoodButton} onPress={navigateToAddFood}>
          <Text style={styles.addFoodText}>Add Food Entry</Text>
        </TouchableOpacity>
      </View>
      
    </View>

  )  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#F4F4F6',
    height: '100%',
  },
  todayContainer: {
    display: 'flex',
    height: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  todayText: {
    fontSize: 18, 
    paddingRight: 5
  },
  calendarIcon: {
    paddingLeft: 5
  },
  barGraphContainer: {
    display: 'flex',
    height: '20%',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  calorieEquationContainer: {
    display: 'flex',
    width: '100%',
    borderRadius: 10,
  },
  totalCaloriesContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60%',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  calculatedCaloriesText: {
    color: '#EC6337',
    fontSize: 35,
    fontWeight: 'bold',
  },
  individualCaloriesText: {
    color: '#EC6337',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mealCaloriesText: {
    fontWeight: 'bold',
  },
  addedMacrosContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderTopWidth: 1,
    borderColor: '#F4F4F6',
    height: '40%',
    width: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  individualMacroContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BodyContainer: {
    //display: 'flex',
    flex: 1,
    height: '62%',
    marginHorizontal: 15,
    paddingVertical: 5,
  },
  foodDiaryContainer: {
    display: 'flex',
    height: '8%',
    //backgroundColor: 'red',
  },
  scrollViewContainer: {
    display: 'flex',
    height: '92%',
    padding: 0,
    flexGrow: 1
  },
  foodDiaryText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  ButtonContainer: {
    display: 'flex',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  AddFoodButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '60%',
    width: '80%',
    borderRadius: 8,
    backgroundColor: '#EC6337',
  },
  MealContainer: {
    //display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: '23%',
    borderRadius: 10,
    marginVertical: 5,
    flexGrow: 1,
    flexShrink: 1,
    alignSelf: 'stretch'
  },
  mealLeftContainer: {
    display: 'flex',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1
  },
  mealRightContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    height: '100%',
    flexGrow: 1
  },
  MealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  CalorieTitle: {
    fontSize: 18,
    color: '#EC6337',
    fontWeight: '500',
  },
  MealHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    height: '40%',
  },
  mealLeftHeader: {
    display: 'flex',
    borderRightWidth: 1,
    borderRightColor: '#828282',
    paddingRight: 5,
  },
  mealRightHeader: {
    display: 'flex',
    paddingLeft: 5,
  },
  arrayMapContainer: {
    display: 'flex',
    height: '60%',
    flexGrow: 1
  },
  mealDisplayContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2.5,
  },
  foodNameContainer: {
    display: 'flex',
    width: '75%',
  },
  innerFoodNameContainer: {
    display: 'flex',
    backgroundColor: '#F4F4F6',
    borderRadius: 15,
    width: '90%',
  },
  innerFoodCaloriesContainer: {
    display: 'flex',
    backgroundColor: '#F4F4F6',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodCaloriesContainer: {
    display: 'flex',
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealDisplayTitle: {
    fontSize: 18,
    paddingLeft: 10,
    color: '#828282',
  },
  calorieDisplayText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#EC6337',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  addFoodText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
});