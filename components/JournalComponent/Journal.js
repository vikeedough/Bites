import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import Food from "@/components/JournalComponent/Food.js"
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CalendarModal from '@/components/JournalComponent/CalendarModal.js';
import {firebaseApp, firebaseAuth, firebaseDb} from '../../firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDoc, onSnapshot, doc, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { ref } from 'firebase/storage';

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;

export default function Journal({navigation}) {

  const todayDateStringID = new Date().toISOString().split('T')[0];

  const [calendarModal, setCalendarModal] = useState(false);
  const [selectedDayID, setSelectedDayID] = useState('');
  const [currentFoodEntry, setCurrentFoodEntry] = useState('');
  const [dateLabel, setDateLabel] = useState('Today');

  const [breakfastArray, setBreakfastArray] = useState([]);
  const [lunchArray, setLunchArray] = useState([]);
  const [dinnerArray, setDinnerArray] = useState([]);
  const [othersArray, setOthersArray] = useState([]);
  // const [totalBreakfastCalories, setTotalBreakfastCalories] = useState(0);
  // const [totalLunchCalories, setTotalLunchCalories] = useState(0);
  // const [totalDinnerCalories, setTotalDinnerCalories] = useState(0);
  // const [totalOthersCalories, setTotalOthersCalories] = useState(0);

  useFocusEffect(
    useCallback(() => {

      if (!selectedDayID) {
        checkAndCreateEntry(todayDateStringID); 
      } else {
        checkAndCreateEntry(selectedDayID)
      }

    }, [currentFoodEntry])
  );

  const checkAndCreateEntry = async (date) => {

    try {

      const docRef = doc(db, 'users', auth.currentUser.uid);
      const foodLogCollectionRef = collection(docRef, 'FoodLog');
      const foodEntryDocRef = doc(foodLogCollectionRef, date);
      const foodEntry = await getDoc(foodEntryDocRef);

      if (!foodEntry.exists()) {

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
      }

      else {
        setCurrentFoodEntry(foodEntry.data());

        setBreakfastArray(foodEntry.data().breakfast);
        setLunchArray(foodEntry.data().lunch);
        setDinnerArray(foodEntry.data().dinner);
        setOthersArray(foodEntry.data().others);
      }

    }

    catch (error) {
      console.error("Error occured when fetching data " + error)
    }
  }
  
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
    console.log("In Journal Page " + currentFoodEntry);
    navigation.navigate('Food', { currentFoodEntry });
  }

  const updateDisplay = (foodArray) => {

    return foodArray.map((food, index) => (
      <View key={index} style={styles.mealDisplayContainer}>

        <View style={styles.foodNameContainer}>
          <View style={styles.innerFoodNameContainer}>
            <Text style={styles.mealDisplayTitle}>{food.foodName}</Text>
          </View>
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
    const totalBfastCalories = breakfastArray.reduce((total, item) => total + item.calories, 0);
    const totalLunchCalories = lunchArray.reduce((total, item) => total + item.calories, 0);
    const totalDinnerCalories = dinnerArray.reduce((total, item) => total + item.calories, 0);
    const totalOthersCalories = othersArray.reduce((total, item) => total + item.calories, 0);
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
        {/* <Text>Today's Date: {todayDateStringID}</Text>
        <Text>Selected Day: {selectedDayID ? selectedDayID : ''}</Text> */}
        {/* <Text style={{fontSize: 20}}>Bar Graph</Text> */}
      </View>

      <View style={styles.BodyContainer}>

        <View style={styles.foodDiaryContainer}>
          <Text style={styles.foodDiaryText}>Food Diary</Text>
        </View>

        <View style={styles.scrollViewContainer}>

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
                    <Text style={styles.CalorieTitle}>{breakfastArray.reduce((total, item) => total + item.calories, 0)} Calories</Text>
                  </View>
                </View>
                <View style={styles.arrayMapContainer}>
                  <ScrollView>
                    {updateDisplay(breakfastArray)}
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
                    <Text style={styles.CalorieTitle}>{lunchArray.reduce((total, item) => total + item.calories, 0)} Calories</Text>
                  </View>
                </View>
                <View style={styles.arrayMapContainer}>
                  <ScrollView>
                    {updateDisplay(lunchArray)}
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
                    <Text style={styles.CalorieTitle}>{dinnerArray.reduce((total, item) => total + item.calories, 0)} Calories</Text>
                  </View>
                </View>
                <View style={styles.arrayMapContainer}>
                  <ScrollView>
                    {updateDisplay(dinnerArray)}
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
                    <Text style={styles.CalorieTitle}>{othersArray.reduce((total, item) => total + item.calories, 0)} Calories</Text>
                  </View>
                </View>
                <View style={styles.arrayMapContainer}>
                  <ScrollView>
                    {updateDisplay(othersArray)}
                  </ScrollView>
                </View>
              </View>
            </View>
        </View>
        
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
    display: 'flex',
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
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    height: '23%',
    borderRadius: 10,
    marginVertical: 5,
  },
  mealLeftContainer: {
    display: 'flex',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealRightContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    height: '100%',
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