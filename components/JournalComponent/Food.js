import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, FlatListComponent, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import MacroButton from '@/components/MacroButton.js';
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { connectStorageEmulator } from 'firebase/storage';
import { set } from 'date-fns';
import AlertModal from "@/components/JournalComponent/AlertModal.js"
import {firebaseApp, firebaseAuth, firebaseDb} from '../../firebaseConfig'
import { collection, getDoc, onSnapshot, doc, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import FoodDatabase from "@/components/FoodDatabase.js";
import flavoursFoodData from '@/components/FoodDatabase.js';

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;

export default function Food() {

  const route = useRoute();
  const { currentFoodEntry } = route.params || {};
  const navigation = useNavigation();
  // console.log("In the Food Page aSDAd")
  // console.log(currentFoodEntry)

  const [selectedFood, setSelectedFood] = useState(null);
  const [mealType, setMealType] = useState(null);
  const [numOfServings, setNumOfServings] = useState(1);
  const [textInputFocus, setTextInputFocus] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [flavoursArray, setFlavoursArray] = useState([]);

  const [calories, setCalories] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);

  const mealTypeData = [
    {label: "Breakfast", value: "breakfast"},
    {label: "Lunch", value: "lunch"},
    {label: "Dinner", value: "dinner"},
    {label: "Others", value: "others"}
  ]

  const flavours = async () => {
    const test = await flavoursFoodData();
    setFlavoursArray(test);
  }
  
  //flavours();

  // const testMealData = [
  //   {id: 0, title: "Chicken Rice", value: "Chicken Rice", calories: 600, carbs: 100, protein: 25, fat: 20},
  //   {id: 1, title: "Fried Rice", value: "Fried Rice" , calories: 700, carbs: 150, protein: 20, fat: 30},
  //   {id: 2, title: "Noodles", value: "Noodles" , calories: 450, carbs: 70, protein: 15, fat: 10},
  //   {id: 3, title: "Pancakes", value: "Pancakes" , calories: 200, carbs: 40, protein: 5, fat: 30}
  // ]

  const onDropdownChange = (item) => {
    setMealType(item.value);
  }

  const renderDropdownItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  }

  const handleNumOfServingsChange = (text) => {

    setNumOfServings(Number(text));

    if (selectedFood) {
      updateMarcoValues(selectedFood, Number(text));
    }
    
  }

  useEffect(() => {
    flavours();
  }, [])

  // console.log("Logging Flavours Array...")
  // console.log(flavoursArray);

  useEffect(() => {
    // console.log("Meal type data: " + mealType)
    // console.log("Num of Servings: " + numOfServings)
    // console.log("Text Input enabled: " + textInputEnabled)
    // [mealType, numOfServings, textInputEnabled]DS

    if (selectedFood) {
      updateMarcoValues(selectedFood, numOfServings);
    }

    // console.log("In useEffect!")
    // console.log(calories);
    // console.log(carbs);
    // console.log(protein);
    // console.log(fat);
    // console.log(mealType);
    
  }, [selectedFood, numOfServings, mealType])

  const onSelectAutoDropdownItem = (food) => {
    if (food) {
      setSelectedFood(food)
      updateMarcoValues(food, numOfServings);
    }
  }

  const updateMarcoValues = (food, servings) => {
    setCalories(food.calories * servings);
    setCarbs(food.carbohydrates * servings);
    setProtein(food.proteins * servings);
    setFat(food.fats * servings);
  }

  const logMealEntry = async () => {

    const newFoodEntry = {
      foodName: selectedFood.food,
      calories: calories,
      carbs: carbs,
      protein: protein,
      fat: fat
    }

    const currentDateID = currentFoodEntry.date;

    try {

      const docRef = doc(db, 'users', auth.currentUser.uid);
      const foodLogCollectionRef = collection(docRef, 'FoodLog');
      const foodEntryDocRef = doc(foodLogCollectionRef, currentDateID);
      const foodEntry = await getDoc(foodEntryDocRef);

      if (foodEntry.exists()) {
        const foodLogArray = foodEntry.data()[mealType];
        const newFoodLogArray = [...foodLogArray, newFoodEntry];

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

  const onTickButtonPress = () => {
    if (selectedFood !== null && mealType !== null) {
      logMealEntry();
      navigation.goBack();
    } else if (!selectedFood) {
      setAlertType('Food');
      setAlertModal(true);
    } else if (!mealType) {
      setAlertType('Meal Type');
      setAlertModal(true);
    }
  }

  return (
    <AutocompleteDropdownContextProvider>
      <View style={styles.container}>

        <AlertModal 
          alertModal={alertModal}
          setAlertModal={setAlertModal}
          alertType={alertType}/>

        <View style={styles.autoDropdownContainer}> 
          <AutocompleteDropdown
            clearOnFocus={true}
            closeOnBlur={true}
            closeOnSubmit={false}
            onSelectItem={onSelectAutoDropdownItem}
            dataSet={flavoursArray}
            
            containerStyle={styles.autoDropdownInputContainer}
            // suggestionsListContainerStyle={styles.suggestionsListContainer}
            inputContainerStyle={styles.autoDropdownText}
            emptyResultText={'No such food found!'}
            textInputProps={{
              placeholder: 'What are you looking for?'
            }}
          />
        </View>

        <View style={styles.mainContainer}>
          <View style={styles.foodTitleContainer}>
            <Text style={styles.foodTitleText}>{selectedFood ? `${selectedFood.food}` : ''}</Text>
          </View>

          <View style={styles.numServingsContainer}>

            <View style={styles.numServingsTextInputContainer}>
              <TextInput style={styles.numberStyle}
                editable={true} 
                selectTextOnFocus={true}
                keyboardType = "numeric"
                value = {numOfServings}
                placeholder={textInputFocus ? '' :'1'}
                onFocus={() => setTextInputFocus(true)}
                //onBlur={() => setTextInputFocus(false)}
                onChangeText={handleNumOfServingsChange}/>
            </View>

            <View style={styles.numServingsTextContainer}>
              <Text style={styles.servingsText}>Number of Servings</Text>
            </View>

          </View>

          <View style={styles.mainBottomContainer}>
            
            <View style={styles.nutritionInfoContainer}>
              <Text style={styles.nutritionInfoText}>Nutrition Information</Text>
              <MaterialCommunityIcons 
                name='pencil-outline' 
                color='#EC6337'
                size={18}
                style={{paddingEnd: 0}}
              />
            </View>

            <View style={styles.totalMacrosContainer}>

              <View style={styles.macrosContainer}>
                <TouchableOpacity style={styles.macroNumberContainer}>
                  <Text style={styles.macroNumber}>{calories ? `${calories}` : 0}</Text>
                </TouchableOpacity>
                  <Text style={styles.macrosText}>Calories</Text>
              </View>

              <View style={styles.macrosContainer}>
                <TouchableOpacity style={styles.macroNumberContainer}>
                  <Text style={styles.macroNumber}>{carbs ? `${carbs}` : 0}g</Text>
                </TouchableOpacity>
                  <Text style={styles.macrosText}>Carbs</Text>
              </View>

              <View style={styles.macrosContainer}>
                <TouchableOpacity style={styles.macroNumberContainer}>
                  <Text style={styles.macroNumber}>{protein ? `${protein}` : 0}g</Text>
                </TouchableOpacity>
                  <Text style={styles.macrosText}>Protein</Text>
              </View>

              <View style={styles.macrosContainer}>
                <TouchableOpacity style={styles.macroNumberContainer}>
                  <Text style={styles.macroNumber}>{fat ? `${fat}` : 0}g</Text>
                </TouchableOpacity>
                  <Text style={styles.macrosText}>Fat</Text>
              </View>

            </View>

            
          </View>
        </View>
        

        <View style={styles.mealTypeContainer}>
          <View style={styles.mealTypeTextContainer}>
            <Text style={styles.mealTypeText}>Meal Type</Text>
          </View>
          <View style={styles.mealTypeDropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={mealTypeData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Meal Type"
            value={mealType}
            onChange={onDropdownChange}
            renderItem={renderDropdownItem}
            />
          </View>
        </View>

        <View style={styles.barGraphContainer}>
          {/* <Text>Bar Graph</Text> */}
        </View>

        <View style={styles.tickContainer}>
          <TouchableOpacity style={styles.tickButtonContainer} onPress={() => onTickButtonPress()}>
            <Text style={styles.addToJournalText}>Add to Journal</Text>
          </TouchableOpacity>
        </View>

      </View>
    </AutocompleteDropdownContextProvider>
    
  );
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#F4F4F6',
  },
  autoDropdownContainer: {
    display: 'flex',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  autoDropdownInputContainer: {
    width: '100%',
  },
  autoDropdownText: {
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  mainContainer: {
    display: 'flex',
    height: '45%',
    marginHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  foodTitleContainer: {
    display: 'flex',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodTitleText: {
    fontSize: 35,
    fontWeight: 'bold',
    paddingLeft: 20,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    display: 'flex',
    height: '15%',
    alignItems: 'center',
  },
  mealTypeTextContainer: {
    flex: 1, 
    alignItems: 'flex-start',
    paddingLeft: 25
  },
  mealTypeDropdownContainer: {
    flex: 1, 
    alignItems: 'flex-end',
    paddingRight: 25,
  },
  numServingsTextContainer: {
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    padding: 5,
  },
  numServingsTextInputContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  numServingsContainer: {
    display: 'flex',
    height: '20%',
    alignItems: 'center',
  },
  servingsText: {
    fontSize: 14,
    color: '#828282',
  },
  mealTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdown: {
    height: 40,
    width: 140,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#EC6337'
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#EC6337'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  numberStyle: {
    width: '50%',
    borderRadius: 10,
    fontSize: 20,
    backgroundColor: '#F4F4F6',
    textAlign: 'center'
  },
  mainBottomContainer: {
    display: 'flex',
    height: '40%',
  },
  nutritionInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '35%',
    borderTopWidth: 1,
    borderTopColor: '#F4F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  nutritionInfoText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  totalMacrosContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '65%',
    padding: 10,
  },
  macrosContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macroNumberContainer: {
    backgroundColor: '#F4F4F6',
    borderRadius: 15,
    padding: 5,
    paddingHorizontal: 15,
  },
  macrosText: {
    fontSize: 12,
    paddingTop: 5,
    fontWeight: 'bold',
    color: '#828282',
  },
  macroNumber: {
    fontSize: 20,
    color: '#F5B09A'
  },
  barGraphContainer: {
    display: 'flex',
    height: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickContainer: {
    display: 'flex',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickButtonContainer: {
    width: '80%',
    height: '45%',
    backgroundColor: '#EC6337',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  addToJournalText: {
    fontSize: 20,
    color: '#FFFFFF',
  }
});





