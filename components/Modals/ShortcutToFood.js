import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback} from "react-native";
import {firebaseApp, firebaseAuth, firebaseDb} from '../../firebaseConfig';
import { collection, getDoc, onSnapshot, doc, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import AlertModal from '@/components/JournalComponent/AlertModal.js';
import { Dropdown, SelectCountry } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { setWeek } from 'date-fns';

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;

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

    useEffect(() => {

        if (selectedFood) {
            updateMarcoValues(selectedFood, numOfServings)
        }

    }, [])

    // useEffect(() => {

    //     if (selectedFood) {
    //         updateMarcoValues(selectedFood, numOfServings)
    //     }

    // }, [numOfServings])

    const mealTypeData = [
        {label: "Breakfast", value: "breakfast"},
        {label: "Lunch", value: "lunch"},
        {label: "Dinner", value: "dinner"},
        {label: "Others", value: "others"}
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

    const updateMarcoValues = (food, servings) => {
        // console.log("In Update macros function")
        setCalories(Math.round(food.calories * servings));
        setCarbs(Math.round(food.carbohydrates * servings));
        setProtein(Math.round(food.proteins * servings));
        setFat(Math.round(food.fats * servings));
    }
    
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

                            <View style={styles.tickContainer}>
                                <TouchableOpacity style={styles.tickButtonContainer} onPress={() => onTickButtonPress()}>
                                    <AntDesign name="check" color={'white'} size={24} />
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
        width: 400,
        height: 400,
        borderRadius: 10,
        //alignItems: 'center',
        //justifyContent: 'center',
        backgroundColor: 'white',
        padding: 10
    },
    foodTitleContainer: {
        flex: 0.20,
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
        flex: 0.20,
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
        flex: 0.20,
        //backgroundColor: 'green',
        alignItems: 'center',
    },
    mealTypeText: {
        fontSize: 20,
        width: 100,
        //backgroundColor: 'red',
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
        flex: 0.20,
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
    tickContainer: {
        flex: 0.20,
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
})