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
import { collection, getDoc, onSnapshot, doc, getDocs, updateDoc, setDoc,  } from 'firebase/firestore';
import foodDatabase from '@/components/FoodDatabase.js';
// import flavoursFoodData from '@/components/FoodDatabase.js';
import CreateOwnFoodModal from "@/components/JournalComponent/CreateOwnFoodModal.js";

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;

export default function Food() {

  const route = useRoute();
  const { currentFoodEntry } = route.params || {};
  const navigation = useNavigation();

  const [selectedFood, setSelectedFood] = useState(null);
  const [mealType, setMealType] = useState(null);
  const [numOfServings, setNumOfServings] = useState(1);
  const [alertModal, setAlertModal] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [foodDataArray, setFoodDataArray] = useState([]);
  // const [flavoursArray, setFlavoursArray] = useState([]);
  // const [personalisedFoodArray, setPersonalisedFoodArray] = useState([]);
  const [createOwnFoodModalVisible, setCreateOwnFoodModalVisible] = useState(false)

  const [numServingsTextInputFocus, setNumServingsTextInputFocus] = useState(false);
  const [caloriesTextInputFocus, setCaloriesTextInputFocus] = useState(false);
  const [carbsTextInputFocus, setCarbsTextInputFocus] = useState(false);
  const [proteinTextInputFocus, setProteinTextInputFocus] = useState(false);
  const [fatTextInputFocus, setFatTextInputFocus] = useState(false);

  const [newUserCalories, setNewUserCalories] = useState(null);
  const [newUserCarbs, setNewUserCarbs] = useState(null);
  const [newUserProtein, setNewUserProtein] = useState(null);
  const [newUserFat, setNewUserFat] = useState(null);

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

  useEffect(() => {

    const fetchFoodDatabase = async () => {
      const totalFoodDatabase = await foodDatabase();
      setFoodDataArray(totalFoodDatabase);
    }

    const fetchInitialPersonalisedFoodData = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const personalisedFoodCollectionRef = collection(docRef, 'Personalised Food');
      const personalisedFoodDocRef = await getDocs(personalisedFoodCollectionRef);

      const initialFoodData = [... foodDataArray];
      personalisedFoodDocRef.forEach((doc) => {
        initialFoodData.push({
          id: doc.id,
          ...doc.data()})
      });
      setFoodDataArray(initialFoodData);
    }
  
    fetchFoodDatabase();
    fetchInitialPersonalisedFoodData();

  }, [])
      
  

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
      const finalCalories = newUserCalories || selectedFood.calories;
      const finalCarbs = newUserCarbs || selectedFood.carbohydrates;
      const finalProtein = newUserProtein || selectedFood.proteins;
      const finalFat = newUserFat || selectedFood.fats;

      updateMarcoValues(finalCalories, finalCarbs, finalProtein, finalFat, Number(text));
    }
    
  }

  useEffect(() => {

    const fetchPersonalisedFoodData = async () => {

      try {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const personalisedFoodCollectionRef = collection(docRef, 'Personalised Food');
        const personalisedFoodDocRef = await getDocs(personalisedFoodCollectionRef);

        const unsubscribePersonalisedFood = onSnapshot(personalisedFoodCollectionRef, async (doc) => {
          doc.docChanges().forEach((change) => {
            if (change.type === 'added') {
              setFoodDataArray((prevDoc) => [...prevDoc, change.doc.data()]);
            }
          })
        })

        return () => {
          unsubscribePersonalisedFood();
        };

      } catch (error) {
        console.log(error);
      }
    }

    fetchPersonalisedFoodData();

  }, [])




  useEffect(() => {

    console.log("In Selected Food Use Effect")

    if (selectedFood) {
      const currCalories = selectedFood.calories;
      const currCarbo = selectedFood.carbohydrates;
      const currProtein = selectedFood.proteins;
      const currFat = selectedFood.fats
      updateMarcoValues(currCalories, currCarbo, currProtein, currFat, numOfServings);
    }

  }, [selectedFood])

  const onSelectAutoDropdownItem = (food) => {
    if (food) {
      setSelectedFood(food);
      const currCalories = food.calories;
      const currCarbo = food.carbohydrates;
      const currProtein = food.proteins;
      const currFat = food.fats
      updateMarcoValues(currCalories, currCarbo, currProtein, currFat, numOfServings);
    }
  }

  const updateMarcoValues = (foodCalories, foodCarbo, foodProtein, foodFat, servings) => {
    setCalories(foodCalories * servings);
    setCarbs(foodCarbo * servings);
    setProtein(foodProtein * servings);
    setFat(foodFat * servings);
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

  const onCreateOwnFoodButtonPress = () => {
    setCreateOwnFoodModalVisible(true);
  }

  const handleMacroNumberChange = (text, setNewBaseMacro, setMacro) => {
    setNewBaseMacro(Number(text));
    setMacro(Number(text));
  }

  // const handleMacroNumberSubmit = (setMacro) => {
  //   const parsedNumber = parseInt(adjustNumber, 10); 
  //   if (!isNaN(parsedNumber)) {
  //     setMacro(parsedNumber);
  //     setAdjustNumber('')
  //     setTextInputFocus(false);
  //   }
  //   //console.log('Confirm Button for Number Input reached');
  // };

  const onTickButtonPress = () => {
    if (selectedFood !== null && mealType !== null) {
      setNewUserCalories(null);
      setNewUserCarbs(null);
      setNewUserProtein(null);
      setNewUserFat(null);

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

        <CreateOwnFoodModal
          createOwnFoodModalVisible={createOwnFoodModalVisible}
          setCreateOwnFoodModalVisible={setCreateOwnFoodModalVisible}/>

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
            dataSet={foodDataArray}
            
            containerStyle={styles.autoDropdownInputContainer}
            // suggestionsListContainerStyle={styles.suggestionsListContainer}
            inputContainerStyle={styles.autoDropdownText}
            emptyResultText={'No such food found!'}
            textInputProps={{
              placeholder: 'What are you looking for?'
            }}
            flatListProps={{
              keyboardDismissMode: undefined,
              onScrollBeginDrag: undefined,
            }}
          />
        </View>

        <View style={styles.createOwnFoodContainer}>
          <TouchableOpacity style={styles.createOwnFoodButtonContainer} onPress={() => onCreateOwnFoodButtonPress()}>
            <Text style={styles.createOwnFoodText}> Create Own Food! </Text>
          </TouchableOpacity>
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
                placeholder={numServingsTextInputFocus ? '' : `${numOfServings}`}
                onFocus={() => setNumServingsTextInputFocus(true)}
                //onBlur={() => setTextInputFocus(false)}
                onChangeText={handleNumOfServingsChange}
                onSubmitEditing={() => setNumServingsTextInputFocus(false)}/>
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
                <TextInput 
                  style={styles.numberMacroStyle}
                  editable={true} 
                  selectTextOnFocus={true}
                  keyboardType = "numeric"
                  value = {calories}
                  onChangeText={text => handleMacroNumberChange(text, setNewUserCalories, setCalories)}
                  onFocus={() => setCaloriesTextInputFocus(true)}
                  placeholder={caloriesTextInputFocus ? '' : `${Math.round(calories)}`}
                  placeholderTextColor={'#EC6337'}
                  onSubmitEditing={() => setCaloriesTextInputFocus(false)}
                  />
                  <Text style={styles.macrosText}>Calories (g)</Text>
              </View>

              <View style={styles.macrosContainer}>
                <TextInput 
                  style={styles.numberMacroStyle}
                  editable={true} 
                  selectTextOnFocus={true}
                  keyboardType = "numeric"
                  value = {carbs}
                  onChangeText={text => handleMacroNumberChange(text, setNewUserCarbs, setCarbs)}
                  onFocus={() => setCarbsTextInputFocus(true)}
                  placeholder={carbsTextInputFocus ? '' : `${Math.round(carbs)}`}
                  placeholderTextColor={'#EC6337'}
                  onSubmitEditing={() => setCarbsTextInputFocus(false)}
                  />
                  <Text style={styles.macrosText}>Carbs (g)</Text>
              </View>

              <View style={styles.macrosContainer}>
                <TextInput 
                  style={styles.numberMacroStyle}
                  editable={true} 
                  selectTextOnFocus={true}
                  keyboardType = "numeric"
                  value = {protein}
                  onChangeText={text => handleMacroNumberChange(text, setNewUserProtein, setProtein)}
                  onFocus={() => setProteinTextInputFocus(true)}
                  placeholder={proteinTextInputFocus ? '' : `${Math.round(protein)}`}
                  placeholderTextColor={'#EC6337'}
                  onSubmitEditing={() => setProteinTextInputFocus(false)}
                  />
                  <Text style={styles.macrosText}>Protein (g)</Text>
              </View>

              <View style={styles.macrosContainer}>
                <TextInput 
                  style={styles.numberMacroStyle}
                  editable={true} 
                  selectTextOnFocus={true}
                  keyboardType = "numeric"
                  value = {fat}
                  onChangeText={text => handleMacroNumberChange(text, setNewUserFat, setFat)}
                  onFocus={() => setFatTextInputFocus(true)}
                  placeholder={fatTextInputFocus ? '' : `${Math.round(fat)}`}
                  placeholderTextColor={'#EC6337'}
                  onSubmitEditing={() => setFatTextInputFocus(false)}
                  />
                  <Text style={styles.macrosText}>Fat (g)</Text>
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

        {/* <View style={styles.barGraphContainer}>
          <Text>Bar Graph</Text>
        </View> */}

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
    //backgroundColor: 'red'
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
    //backgroundColor: 'green'
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
    //backgroundColor: 'yellow'
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
    backgroundColor: 'blue'
  },
  tickContainer: {
    display: 'flex',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'red'
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
  },
  numberMacroStyle: {
    width: 'auto',
    height: 36,
    textAlign: 'center',
    justifyContent:'center',
    fontSize: 15,
    backgroundColor: '#F4F4F6',
    borderRadius: 15,
    padding: 5,
    paddingHorizontal: 15,
    color: '#EC6337'
  },
  createOwnFoodContainer: {
    height: '10%',
    alignItems: 'center',
  },
  createOwnFoodButtonContainer: {
    width: '50%',
    height: '55%',
    backgroundColor: '#EC6337',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  createOwnFoodText: {
    fontSize: 18,
    color: '#FFFFFF',
  }
});





