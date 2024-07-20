import { useEffect, useState, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CalendarModal from '@/components/JournalComponent/CalendarModal.js';
import { firebaseAuth, firebaseDb } from '../../firebaseConfig'
import { collection, getDoc, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import UpdateDisplayComponent from '@/components/JournalComponent/UpdateDisplayComponent.js';
import * as Progress from 'react-native-progress';
import JournalInfo from '../Modals/JournalInfo';

const auth = firebaseAuth;
const db = firebaseDb;

export default function Journal({navigation}) {

  const todayDateStringID = new Date().toISOString().split('T')[0];

  const [calendarModal, setCalendarModal] = useState(false);
  const [selectedDayID, setSelectedDayID] = useState(null);
  const [currentFoodEntry, setCurrentFoodEntry] = useState('');
  const [dateLabel, setDateLabel] = useState('Today');
  const [modalVisible, setModalVisible] = useState(false);

  const [userTotalCalories, setUserTotalCalories] = useState(0);
  const [breakfast, setBreakfast] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [dinner, setDinner] = useState([]);
  const [others, setOthers] = useState([]);

  const openInfo = () => {
    setModalVisible(true);
  }

  const closeInfo = () => {
      setModalVisible(false);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="help-circle-outline"
          color={'white'}
          size={24}
          onPress={() => setModalVisible(true)}
        />
      ),
    });
  }, [navigation]);

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
          achievement: false,
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


  const atLeastTwoMealsLogged = (breakfast, lunch, dinner, others) => {

    let totalFoodLogs = 0

    if (breakfast.length > 0) totalFoodLogs++;
    if (lunch.length > 0) totalFoodLogs++;
    if (dinner.length > 0) totalFoodLogs++;
    if (others.length > 0) totalFoodLogs++;

    if (totalFoodLogs >= 2) {
      return true;
    }

    return false;

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

        const unsubscribe = onSnapshot(foodEntryDocRef, async (doc) => {
          const breakfastSnapshot = doc.data().breakfast;
          const lunchSnapshot = doc.data().lunch;
          const dinnerSnapshot = doc.data().dinner;
          const othersSnapshot = doc.data().others;
          const achievement = doc.data().achievement;

          setBreakfast(breakfastSnapshot)
          setLunch(lunchSnapshot)
          setDinner(dinnerSnapshot)
          setOthers(othersSnapshot)

          if (!achievement) {

            const mealsLogged = atLeastTwoMealsLogged(breakfastSnapshot, lunchSnapshot, dinnerSnapshot, othersSnapshot)

            if (mealsLogged) {

              const docSnapshot = await getDoc(docRef)
              const numberOfFoodLogs = docSnapshot.data().numberOfFoodLogs

              //console.log(numberOfFoodLogs)
              const newNumberOfFoodLogs = numberOfFoodLogs + 1;
              //console.log(newNumberOfFoodLogs)

              await updateDoc(docRef, {
                numberOfFoodLogs : newNumberOfFoodLogs
              });
  
              await updateDoc(foodEntryDocRef, {
                achievement : true
              });
  
            }
          }

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

  const fetchUserCalories = async () => { 

    //console.log("In fetching calorie data")

    try {

      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnapshot = await getDoc(docRef);
      const userGoalsArray = docSnapshot.data().macroGoals;
      console.log('found Goals array');
      const userCalories = userGoalsArray[0] || 0;
      console.log(userCalories)
      setUserTotalCalories(userCalories);

    } catch (error) {
      console.log("Unsuccessful in fetching user calories " + error)
    }
  }

  const calorieEquation = () => {
    //console.log("In calorie Equation")

    const [totalCalories, setTotalCalories] = useState(0);
    const [totalBfastCalories, setTotalBfastCalories] = useState(0);
    const [totalLunchCalories, setTotalLunchCalories] = useState(0);
    const [totalDinnerCalories, setTotalDinnerCalories] = useState(0);
    const [totalOthersCalories, setTotalOthersCalories] = useState(0);
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState('');
    

    // update the totals when any meal is added
    useEffect(() => {
      fetchUserCalories().then(() => {
        setTotalBfastCalories(breakfast.reduce((total, item) => total + item.calories, 0));
        setTotalLunchCalories(lunch.reduce((total, item) => total + item.calories, 0));
        setTotalDinnerCalories(dinner.reduce((total, item) => total + item.calories, 0));
        setTotalOthersCalories(others.reduce((total, item) => total + item.calories, 0));
      }).catch(error => {
        console.error("Error in fetchUserCalories:", error);
      });
    }, [breakfast, lunch, dinner, others]); 
  
    // update progress circle when the totals are updated
    useEffect(() => {
      const totalCaloriesSum = totalBfastCalories + totalLunchCalories + totalDinnerCalories + totalOthersCalories;
      const calculatedProgress = userTotalCalories > 0 ? totalCaloriesSum / userTotalCalories : 0;
      const progressPercentage = Math.round(calculatedProgress * 100);
  
      setTotalCalories(totalCaloriesSum);
      setProgress(calculatedProgress > 1 ? 1 : calculatedProgress);
      setProgressText(progressPercentage);
    }, [totalBfastCalories, totalLunchCalories, totalDinnerCalories, totalOthersCalories, userTotalCalories]);

    return (
      <View style={styles.calorieEquationContainer}>
        <View style={styles.totalCaloriesContainer}>
          <View>
            <Text style={styles.calculatedCaloriesText}>{totalCalories}</Text>
            <Text style={styles.mealCaloriesText}>Total Calories</Text>
          </View>
          <View>
            <Progress.Circle
              progress={progress}
              showsText
              size={60}
              thickness={8}
              color='#EC6337'
              borderWidth={0}
              textStyle={{fontSize: 14, fontWeight: 'bold'}}
              animated
              formatText={() => `${progressText}%`} 
              />
          </View>
        
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
            <Ionicons name="calendar" color={'#EC6337'} size={24} style={{paddingEnd: 0,}} />
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
                    <UpdateDisplayComponent 
                      foodArray={breakfast}
                      mealType={'breakfast'}
                      selectedDayID={selectedDayID}
                    />
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
                    <UpdateDisplayComponent 
                      foodArray={lunch}
                      mealType={'lunch'} 
                      selectedDayID={selectedDayID}
                    />
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
                    <UpdateDisplayComponent 
                      foodArray={dinner}
                      mealType={'dinner'} 
                      selectedDayID={selectedDayID}
                    />
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
                    <UpdateDisplayComponent 
                      foodArray={others}
                      mealType={'others'} 
                      selectedDayID={selectedDayID}
                    />
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
      
      <JournalInfo isVisible={modalVisible} onClose={closeInfo}/>

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
    backgroundColor: '#FFFFFF',
    width: '25%',
    paddingHorizontal: 5,
    marginHorizontal: 15,
    marginVertical: 3,
    borderRadius: 10,
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '60%',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    //backgroundColor: 'red',
    flexDirection: 'row'
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