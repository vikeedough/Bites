import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, FlatListComponent } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import MacroButton from '@/components/MacroButton.js';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { connectStorageEmulator } from 'firebase/storage';
import { set } from 'date-fns';
import AlertModal from "@/components/JournalComponent/AlertModal.js"
import {firebaseApp, firebaseAuth, firebaseDb} from '../../firebaseConfig'
import { collection, getDoc, onSnapshot, doc, getDocs, updateDoc, setDoc } from 'firebase/firestore';

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;

export default function Food() {

  const route = useRoute();
  const { currentFoodEntry } = route.params || {};
  const navigation = useNavigation();
  console.log("In the Food Page aSDAd")
  console.log(currentFoodEntry)

  const [selectedFood, setSelectedFood] = useState(null);
  const [mealType, setMealType] = useState(null);
  const [numOfServings, setNumOfServings] = useState(1);
  const [textInputFocus, setTextInputFocus] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [alertType, setAlertType] = useState('')

  const [calories, setCalories] = useState(0)
  const [carbs, setCarbs] = useState(0)
  const [protein, setProtein] = useState(0)
  const [fat, setFat] = useState(0)

  const mealTypeData = [
    {label: "Breakfast", value: "breakfast"},
    {label: "Lunch", value: "lunch"},
    {label: "Dinner", value: "dinner"},
    {label: "Others", value: "others"}
  ]

  const testMealData = [
    {id: 0, title: "Chicken Rice", value: "Chicken Rice", calories: 600, carbs: 100, protein: 25, fat: 20},
    {id: 1, title: "Fried Rice", value: "Fried Rice" , calories: 700, carbs: 150, protein: 20, fat: 30},
    {id: 2, title: "Noodles", value: "Noodles" , calories: 450, carbs: 70, protein: 15, fat: 10},
    {id: 3, title: "Pancakes", value: "Pancakes" , calories: 200, carbs: 40, protein: 5, fat: 30}
  ]

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
    // console.log("Meal type data: " + mealType)
    // console.log("Num of Servings: " + numOfServings)
    // console.log("Text Input enabled: " + textInputEnabled)
    // [mealType, numOfServings, textInputEnabled]DS

    if (selectedFood) {
      updateMarcoValues(selectedFood, numOfServings);
    }

    console.log("In useEffect!")
    console.log(calories);
    console.log(carbs);
    console.log(protein);
    console.log(fat);
    console.log(mealType);
    

  }, [selectedFood, numOfServings, mealType])

  const onSelectAutoDropdownItem = (food) => {
    if (food) {
      setSelectedFood(food)
      updateMarcoValues(food, numOfServings);
    }
  }

  const updateMarcoValues = (food, servings) => {
    setCalories(food.calories * servings);
    setCarbs(food.carbs * servings);
    setProtein(food.protein * servings);
    setFat(food.fat * servings);
  }

  const logMealEntry = async () => {

    const newFoodEntry = {
      foodName: selectedFood.title,
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
            dataSet={testMealData}
            containerStyle={styles.autoDropdownInputContainer}
            // suggestionsListContainerStyle={styles.suggestionsListContainer}
            inputContainerStyle={styles.autoDropdownText}
            emptyResultText={'No such food found!'}
            textInputProps={{
              placeholder: 'E.g. Chicken Rice'
            }}
          />
        </View>

        <View style={styles.foodTitleContainer}>
          <Text style={styles.foodTitleText}>{selectedFood ? `${selectedFood.title}` : ''}</Text>
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

        <View style={styles.numServingsContainer}>
          <View style={styles.numServingsTextContainer}>
            <Text style={styles.mealTypeText}>Number of Servings</Text>
          </View>
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
        </View>

        <View style={styles.totalMacrosContainer}>
          <View style={styles.macrosContainer}>
            <TouchableOpacity>
              <Text style={styles.macroNumber}>{calories ? `${calories}` : 0}</Text>
            </TouchableOpacity>
              <Text style={styles.macrosText}>Calories</Text>
          </View>

          <View style={styles.macrosContainer}>
            <TouchableOpacity>
              <Text style={styles.macroNumber}>{carbs ? `${carbs}` : 0}g</Text>
            </TouchableOpacity>
              <Text style={styles.macrosText}>Carbs</Text>
          </View>

          <View style={styles.macrosContainer}>
            <TouchableOpacity>
              <Text style={styles.macroNumber}>{protein ? `${protein}` : 0}g</Text>
            </TouchableOpacity>
              <Text style={styles.macrosText}>Protein</Text>
          </View>

          <View style={styles.macrosContainer}>
            <TouchableOpacity>
              <Text style={styles.macroNumber}>{fat ? `${fat}` : 0}g</Text>
            </TouchableOpacity>
              <Text style={styles.macrosText}>Fat</Text>
          </View>
        </View>

        <View style={styles.barGraphContainer}>
          <Text>Bar Graph</Text>
        </View>

        <View style={styles.tickContainer}>
          <TouchableOpacity style={styles.tickButtonContainer} onPress={() => onTickButtonPress()}>
            <AntDesign name="check" color={'white'} size={24} />
          </TouchableOpacity>
        </View>
     
      </View>
    </AutocompleteDropdownContextProvider>
    
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  autoDropdownContainer: {
    flex: 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    //backgroundColor: 'red'
  },
  autoDropdownInputContainer: {
    width: 380,
  },
  autoDropdownText: {
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  foodTitleContainer: {
    flex: 0.12,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    //backgroundColor: 'red'
  },
  foodTitleText: {
    fontSize: 35,
    fontWeight: 'bold',
    paddingLeft: 20,
  },

  mealTypeContainer: {
    flexDirection: 'row',
    flex: 0.12,
    //backgroundColor: 'blue',
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
    flex: 1, 
    alignItems: 'flex-start',
    paddingLeft: 25
  },
  numServingsTextInputContainer: {
    flex: 1, 
    alignItems: 'flex-end',
    paddingRight: 25
  },
  numServingsContainer: {
    flexDirection: 'row',
    flex: 0.12,
    //backgroundColor: 'green',
    alignItems: 'center',
  },
  mealTypeText: {
    fontSize: 20,
    width: 100,
    //backgroundColor: 'red',
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
    width: 70,
    height: 35,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 20,
    textAlign: 'center'
  },
  totalMacrosContainer: {
    flex: 0.15,
    flexDirection: 'row',
    //backgroundColor: 'yellow'
  },
  macrosContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macrosText: {
    fontSize: 12,
    paddingTop: 5,
    fontWeight: 'bold'
  },
  macroNumber: {
    fontSize: 20,
    color: '#EC6337'
  },
  barGraphContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'red'
  },
  tickContainer: {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'green'
  },
  tickButtonContainer: {
    width: 75,
    height: 30,
    backgroundColor: '#EC6337',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  }
});





