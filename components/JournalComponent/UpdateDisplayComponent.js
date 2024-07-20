import { useState }from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import DeleteEntryModal from "@/components/JournalComponent/DeleteEntryModal.js";
import { firebaseAuth, firebaseDb} from '../../firebaseConfig'
import { collection, getDoc, doc, updateDoc } from 'firebase/firestore';

const auth = firebaseAuth;
const db = firebaseDb;

export default function UpdateDisplayComponent({foodArray, mealType, selectedDayID}) {

  const todayDateStringID = new Date().toISOString().split('T')[0];

  console.log("In Update Display Component")

  const [deleteEntryModal, setDeleteEntryModal] = useState(false);

  const deleteEntry = async (mealType, foodName) => {

    console.log("In Delete entry")

    const date = selectedDayID ? selectedDayID : todayDateStringID
    
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

const styles = StyleSheet.create({
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
  }
})