import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";
import {firebaseApp, firebaseAuth, firebaseDb} from '../../firebaseConfig';
import { collection, getDoc, doc, updateDoc } from 'firebase/firestore';
import AlertModal from '@/components/JournalComponent/AlertModal.js';
import { Dropdown } from 'react-native-element-dropdown';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;

//Shortcut to Add Food in Map page
export default function ShortcutToFood({selectedFood, shortcutModal, setShortcutModal}) {

    // console.log("In Shortcut to Food");
    // console.log(selectedFood);

    const [mealType, setMealType] = useState(null);
    const [numOfServings, setNumOfServings] = useState(1);
    const [textInputFocus, setTextInputFocus] = useState(false);
    const [alertModal, setAlertModal] = useState(false);
    const [alertType, setAlertType] = useState('');

    const [calories, setCalories] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);

    //When component first mounts, check if selected food is not null, update macro values based on food selected and number of servings
    useEffect(() => {

        if (selectedFood) {
            updateMarcoValues(selectedFood, numOfServings)
        }

    }, [])

    const mealTypeData = [
        {label: "Breakfast", value: "breakfast"},
        {label: "Lunch", value: "lunch"},
        {label: "Dinner", value: "dinner"},
        {label: "Others", value: "others"}
    ]

    //Handle dropdown item change
    const onDropdownChange = (item) => {
        setMealType(item.value);
    }
    
    //Handle dropdown item change, re-render dropdown
    const renderDropdownItem = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
            </View>
        );
    }

    //Handle text input change 
    const handleNumOfServingsChange = (text) => {   
        setNumOfServings(Number(text));

        if (selectedFood) {
            updateMarcoValues(selectedFood, Number(text));
        }
        
    }

    //Update macro values to preset values from FoodData base
    const updateMarcoValues = (food, servings) => {
        // console.log("In Update macros function")
        setCalories(Math.round(food.calories * servings));
        setCarbs(Math.round(food.carbohydrates * servings));
        setProtein(Math.round(food.proteins * servings));
        setFat(Math.round(food.fats * servings));
    }
    
    //Log meal entry and upload it to Firebase user's FoodLog sub-collection
    const logMealEntry = async () => {

        const newFoodEntry = {
            foodName: selectedFood.food,
            calories: calories,
            carbs: carbs,
            protein: protein,
            fat: fat
        }

        const todayDateStringID = new Date().toISOString().split('T')[0];

        try {

            const docRef = doc(db, 'users', auth.currentUser.uid);
            const foodLogCollectionRef = collection(docRef, 'FoodLog');
            const foodEntryDocRef = doc(foodLogCollectionRef, todayDateStringID);
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

    //Handle on Tick button press
    const onTickButtonPress = () => {
        if (selectedFood !== null && mealType !== null) {
          logMealEntry();
          setShortcutModal(false);
        } else if (!selectedFood) {
          setAlertType('Food');
          setAlertModal(true);
        } else if (!mealType) {
          setAlertType('Meal Type');
          setAlertModal(true);
        }
    }

    return (
        <Modal
            style={{margin: 0}}
            animationType='fade'
            visible={shortcutModal}
            transparent={true}
            onRequestClose={() => {setShortcutModal(false)}}>
            <TouchableWithoutFeedback onPress={() => {setShortcutModal(false)}}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <AlertModal 
                                alertModal={alertModal}
                                setAlertModal={setAlertModal}
                                alertType={alertType}/>

                            <View style={styles.foodTitleContainer}>
                                <Text style={styles.foodTitleText}>{selectedFood ? `${selectedFood.food}` : "Test"}</Text>
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

                            <View style={styles.tickContainer}>
                                <TouchableOpacity style={styles.tickButtonContainer} onPress={() => onTickButtonPress()}>
                                    <Text style={styles.addToJournalText}>Add to Journal</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }, 
    modalContent: {
        width: '90%',
        height: '60%',
        borderRadius: 10,
        //alignItems: 'center',
        //justifyContent: 'center',
        backgroundColor: 'white',
        padding: 10
    },
    foodTitleContainer: {
        display: 'flex',
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'red'
    },
    foodTitleText: {
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    mealTypeContainer: {
        flexDirection: 'row',
        display: 'flex',
        height: '20%',
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
    numServingsTextContainer: {
        display: 'flex',
        height: '50%',
        width: '100%',
        padding: 5,
        alignItems: 'center',
    },
    numServingsTextInputContainer: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    numServingsContainer: {
        flexDirection: 'column',
        display: 'flex',
        height: '15%',
        //backgroundColor: 'green',
        alignItems: 'center',
    },
    mealTypeText: {
        fontSize: 18,
        fontWeight: 'bold',
        //backgroundColor: 'red',
    },
    numberStyle: {
        width: '45%',
        borderRadius: 10,
        fontSize: 20,
        backgroundColor: '#F4F4F6',
        textAlign: 'center'
    },
    servingsText: {
        fontSize: 14,
        color: '#828282',
    },
    mainBottomContainer: {
        display: 'flex',
        height: '30%',
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
    macrosText: {
        fontSize: 12,
        paddingTop: 5,
        fontWeight: 'bold',
        color: '#828282',
    },
    macroNumberContainer: {
        backgroundColor: '#F4F4F6',
        borderRadius: 15,
        padding: 5,
        paddingHorizontal: 15,
    },
    macroNumber: {
        fontSize: 20,
        color: '#F5B09A'
    },
    tickContainer: {
        display: 'flex',
        height: '15%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tickButtonContainer: {
        width: '80%',
        height: '55%',
        backgroundColor: '#EC6337',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    addToJournalText: {
        fontSize: 20,
        color: '#FFFFFF',
    },
})