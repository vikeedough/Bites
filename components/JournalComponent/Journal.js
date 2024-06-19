import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import Food from "@/components/JournalComponent/Food.js"
import { Ionicons } from '@expo/vector-icons';
import CalendarModal from '@/components/JournalComponent/CalendarModal.js';
import {firebaseApp, firebaseAuth, firebaseDb} from '../../firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDoc, onSnapshot, doc, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;
//export let passedFoodEntry; 

export default function Journal({navigation}) {

  const todayDateStringID = new Date().toISOString().split('T')[0];

  const [calendarModal, setCalendarModal] = useState(false);
  const [selectedDayID, setSelectedDayID] = useState('');
  const [currentFoodEntry, setCurrentFoodEntry] = useState('');
  const [dateLabel, setDateLabel] = useState('Today')

  const checkAndCreateEntry = async (date) => {

    try {

      const docRef = doc(db, 'users', auth.currentUser.uid);
      const foodLogCollectionRef = collection(docRef, 'FoodLog');
      const foodEntryDocRef = doc(foodLogCollectionRef, date);
      const foodEntry = await getDoc(foodEntryDocRef)

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
        setCurrentFoodEntry(foodEntry.data())
      }

      console.log(currentFoodEntry)
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

  useEffect(() => {
    checkAndCreateEntry(todayDateStringID)
  }, [])

  const calendarLabel = (newDay) => {
    if (newDay === todayDateStringID) {
      setDateLabel("Today");
    } else {
      setDateLabel(String(newDay));
    }
  }

  const navigateToAddFood = () => {
    console.log("In Journal Page " + currentFoodEntry);
    //passedFoodEntry = currentFoodEntry;
    navigation.navigate(Food);
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
        <Text>Today's Date: {todayDateStringID}</Text>
        <Text>Selected Day: {selectedDayID}</Text>
        {/* <Text style={{fontSize: 20}}>Bar Graph</Text> */}
      </View>

      <View style={styles.BodyContainer}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>

          <View style ={styles.MealContainer}>
            <View style={styles.MealHeader}>
              <View style={{flex: 1}}>
                <Text style={styles.MealTitle}>Breakfast</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.CalorieTitle}>Calories: 0</Text>
              </View>
            </View>
            <ScrollView contentContainerStyle={{flex: 0.8}}>
              <Text></Text>
            </ScrollView>
          </View>

          <View style ={styles.MealContainer}>
            <View style={styles.MealHeader}>
              <View style={{flex: 1}}>
                <Text style={styles.MealTitle}>Lunch</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.CalorieTitle}>Calories: 0</Text>
              </View>
            </View>
            <View style ={{flex: 0.8}}>
              <Text></Text>
            </View>
          </View>

          <View style ={styles.MealContainer}>
            <View style={styles.MealHeader}>
              <View style={{flex: 1}}>
                <Text style={styles.MealTitle}>Dinner</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.CalorieTitle}>Calories: 0</Text>
              </View>
            </View>
            <View style ={{flex: 0.8}}>
              <Text></Text>
            </View>
          </View>

          <View style ={styles.MealContainer}>
            <View style={styles.MealHeader}>
              <View style={{flex: 1}}>
                <Text style={styles.MealTitle}>Others</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.CalorieTitle}>Calories: 0</Text>
              </View>
            </View>
            <View style ={{flex: 0.8}}>
              <Text></Text>
            </View>
          </View>
          
        </ScrollView>
      </View>

      <View style={styles.ButtonContainer}>
        <TouchableOpacity style={styles.AddFoodButton} onPress={navigateToAddFood}>
          <Text>Add Food</Text>
        </TouchableOpacity>
      </View>
      
    </View>

  )  
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  todayContainer: {
    flex: 0.06,
    flexDirection: 'row',
    borderBottomWidth: 0.6,
    borderTopWidth: 0.6,
    //backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  todayText: {
    fontSize: 18, 
    paddingRight: 5
  },
  calendarIcon: {
    paddingLeft: 5
  },
  barGraphContainer: {
    flex: 0.15,
    borderBottomWidth: 0.6,
    //backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center'
  },
  BodyContainer: {
    flex: 0.70,
    //backgroundColor: 'yellow',
  },
  ButtonContainer: {
    flex: 0.09,
    borderBottomWidth: 0.6,
    //backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center'
  },
  AddFoodButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#EC6337',
  },
  MealContainer: {
    flex: 0.25,
    borderBottomWidth: 0.6,
  },
  MealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  CalorieTitle: {
    fontSize: 18,
    fontWeight: 'bold', 
    textAlign: 'right',
    paddingRight: 10
  },
  MealHeader: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    borderBottomWidth: 0.6,
    //backgroundColor: 'red'
  }
});