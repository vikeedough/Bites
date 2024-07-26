import { useState }from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import {firebaseAuth, firebaseDb} from '../../firebaseConfig'
import { collection, getDoc, doc, setDoc } from 'firebase/firestore';

const auth = firebaseAuth;
const db = firebaseDb;

export default function createOwnFood ({createOwnFoodModalVisible, setCreateOwnFoodModalVisible}) {

    const [newFoodName, setNewFoodName] = useState(null);
    const [newCalories, setNewCalories] = useState(null);
    const [newCarbs, setNewCarbs] = useState(null);
    const [newProtein, setNewProtein] = useState(null);
    const [newFat, setNewFat] = useState(null);

    const [foodInputFocus, setFoodInputFocus] = useState(false);
    const [caloriesInputFocus, setCaloriesInputFocus] = useState(false);
    const [carbsInputFocus, setCarbsInputFocus] = useState(false);
    const [proteinInputFocus, setProteinInputFocus] = useState(false);
    const [fatInputFocus, setFatInputFocus] = useState(false);

    const handleFoodNameChange = (text) => {
        setNewFoodName(text)
    }

    const handleMacroChange = (text, setMacro) => {
        setMacro(Number(text));
    }

    const handleConfirmButton = async () => {

        const caloriesTest = newCalories === 0 ? true : newCalories;
        const carbsTest = newCarbs === 0 ? true : newCarbs;
        const proteinsTest = newProtein === 0 ? true : newProtein;
        const fatsTest = newFat === 0 ? true : newFat

        try {
            
            if (newFoodName && caloriesTest && carbsTest && proteinsTest && fatsTest) {

                const newFood = {
                    calories: Number(newCalories),
                    carbohydrates: Number(newCarbs),
                    fats: Number(newFat), 
                    proteins: Number(newProtein),
                    food: newFoodName,
                    title: newFoodName
                }

                await uploadNewFood(newFood);
                
                setNewFoodName(null);
                setNewCalories(null);
                setNewCarbs(null);
                setNewProtein(null);
                setNewFat(null);
    
                setCreateOwnFoodModalVisible(false)
            }
        } 

        catch (error) {
            console.log("Error creating new food " + error)
        }
        
    }

    const uploadNewFood = async (newFood) => {
        try {

            const docRef = doc(db, 'users', auth.currentUser.uid);
            const personalisedFoodCollectionRef = collection(docRef, 'Personalised Food');
            const personalisedFoodDocRef = doc(personalisedFoodCollectionRef, newFoodName);
            const personalisedFood = await getDoc(personalisedFoodDocRef);

            if (!personalisedFood.exists()) {
                await setDoc(personalisedFoodDocRef, newFood)
            } else {
                console.log("Food already exists!");
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Modal
            style={{margin: 0}}
            animationType='fade'
            visible={createOwnFoodModalVisible}
            transparent={true}
            onRequestClose={() => {setCreateOwnFoodModalVisible(false)}}>
            <View style={styles.container}>
                <View style={styles.modalContent}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Create Own Food</Text>
                    </View>
                    <View style={styles.mainBodyContainer}>
                        <View style={styles.detailContainer}>
                            <View style={styles.detailNameContainer}>
                                <Text style={styles.detailText}>Food Name</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <TextInput 
                                    style={styles.textInputStyle}
                                    editable={true} 
                                    selectTextOnFocus={true}
                                    value = {newFoodName}
                                    onChangeText={handleFoodNameChange}
                                    onFocus={() => setFoodInputFocus(true)}
                                    placeholder={foodInputFocus ? '' : newFoodName ? `${newFoodName}` : ''}
                                    placeholderTextColor={'#EC6337'}
                                    onSubmitEditing={() => setFoodInputFocus(false)}
                                    />
                            </View>     
                        </View>
                        <View style={styles.detailContainer}>
                            <View style={styles.detailNameContainer}>
                                <Text style={styles.detailText}>Calories</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <TextInput 
                                    style={styles.textInputStyle}
                                    editable={true}
                                    inputMode='numeric'
                                    selectTextOnFocus={true}
                                    value = {newCalories}
                                    onChangeText={text => handleMacroChange(text, setNewCalories)}
                                    onFocus={() => setCaloriesInputFocus(true)}
                                    placeholder={caloriesInputFocus ? '' : newCalories ? `${newCalories}` : ''}
                                    placeholderTextColor={'#EC6337'}
                                    onSubmitEditing={() => setCaloriesInputFocus(false)}
                                    />
                            </View>     
                        </View>
                        <View style={styles.detailContainer}>
                            <View style={styles.detailNameContainer}>
                                <Text style={styles.detailText}>Carbohydrates</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <TextInput 
                                    style={styles.textInputStyle}
                                    editable={true}
                                    inputMode='numeric'
                                    selectTextOnFocus={true}
                                    value = {newCarbs}
                                    onChangeText={text => handleMacroChange(text, setNewCarbs)}
                                    onFocus={() => setCarbsInputFocus(true)}
                                    placeholder={carbsInputFocus ? '' : newCarbs ? `${newCarbs}` : ''}
                                    placeholderTextColor={'#EC6337'}
                                    onSubmitEditing={() => setCarbsInputFocus(false)}
                                    />
                            </View>     
                        </View>
                        <View style={styles.detailContainer}>
                            <View style={styles.detailNameContainer}>
                                <Text style={styles.detailText}>Proteins</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <TextInput 
                                    style={styles.textInputStyle}
                                    editable={true}
                                    inputMode='numeric'
                                    selectTextOnFocus={true}
                                    value = {newProtein}
                                    onChangeText={text => handleMacroChange(text, setNewProtein)}
                                    onFocus={() => setProteinInputFocus(true)}
                                    placeholder={proteinInputFocus ? '' : newProtein ? `${newProtein}` : ''}
                                    placeholderTextColor={'#EC6337'}
                                    onSubmitEditing={() => setProteinInputFocus(false)}
                                    />
                            </View>     
                        </View>
                        <View style={styles.detailContainer}>
                            <View style={styles.detailNameContainer}>
                                <Text style={styles.detailText}>Fat</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                                <TextInput 
                                    style={styles.textInputStyle}
                                    editable={true}
                                    inputMode='numeric'
                                    selectTextOnFocus={true}
                                    value = {newFat}
                                    onChangeText={text => handleMacroChange(text, setNewFat)}
                                    onFocus={() => setFatInputFocus(true)}
                                    placeholder={fatInputFocus ? '' : newFat ? `${newFat}` : ''}
                                    placeholderTextColor={'#EC6337'}
                                    onSubmitEditing={() => setFatInputFocus(false)}
                                    />
                            </View>     
                        </View>
                        <View style={styles.bottomButtonContainer}>
                            <View style={styles.cancelButtonContainer}>
                                <TouchableOpacity style={styles.button} onPress={() => setCreateOwnFoodModalVisible(false)}>
                                    <Text style={styles.buttonText}> Cancel </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.confirmButtonContainer}>
                                <TouchableOpacity style={styles.button} onPress={() => handleConfirmButton()}>
                                    <Text style={styles.buttonText}> Confirm </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>   
                </View>
            </View>
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
        width: 300,
        height: 375,
        borderRadius: 10,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: 'white',
    },
    titleContainer: {
        flex: 0.15,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.2
    },
    titleText: {
        fontSize: 30,
        color: '#EC6337'
    },
    mainBodyContainer: {
        flex: 0.85,
        marginTop: 10,
        //backgroundColor: 'blue'
    },
    detailContainer: {
        flex: 0.16,
        flexDirection: 'row',
        alignItems: 'center',   
    },
    detailText :{
        fontSize: 18,
        color: '#EC6337'
    },
    detailNameContainer: {
        flex: 1,
        alignItems: 'flex-start',
        paddingLeft: 15   
    },
    textInputContainer: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: 20
    },
    textInputStyle: {
        width: 'auto',
        minWidth: 100,
        maxWidth: 130,
        height: 30,
        textAlign: 'center',
        justifyContent:'center',
        fontSize: 15,
        backgroundColor: '#F4F4F6',
        borderRadius: 15,
        padding: 5,
        paddingHorizontal: 15,
        color: '#EC6337'
    },
    bottomButtonContainer: {
        flex: 0.2,
        flexDirection: 'row',
        alignItems: 'center',
        //backgroundColor: 'red'
    },
    cancelButtonContainer: {
        flex: 1,
        alignItems: 'flex-start',
        paddingLeft: 20,
        alignItems: 'center',
    },
    button: {
        width: 80,
        height: 30,
        backgroundColor: '#EC6337',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 15,
        color: 'white'
    },
    confirmButtonContainer: {
        flex: 1,
        alignItems: 'flex-end',
        paddingRight: 20,
        alignItems: 'center',
    },
});