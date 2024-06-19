import { useState, useEffect } from "react";
import { Button, Modal, StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import { getDoc, doc } from 'firebase/firestore';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { firebaseAuth, firebaseDb } from "@/firebaseConfig";
import AntDesign from '@expo/vector-icons/AntDesign';

const Tab = createMaterialTopTabNavigator();
const auth = firebaseAuth;
const db = firebaseDb;

const Recommended = ({route}) => {

    const user = auth.currentUser.uid;
    const [macroGoalsArray, setMacroGoalsArray] = useState([]);

    const findMacroGoals = async () => {
        const findMacroGoals = (await getDoc(doc(db, 'users', user))).data();
        console.log(findMacroGoals);
        setMacroGoalsArray(findMacroGoals.macroGoals);
        console.log(macroGoalsArray);
    }
    
    useEffect(() => {
        findMacroGoals();
      }, [user]);
    
    const { foodArray } = route.params;
    const renderItem = ({item}) => 
        <Result 
            stallName={item.stall} 
            foodName={item.food} 
            calories={item.calories} 
            carbs={item.carbohydrates} 
            proteins={item.proteins} 
            fats={item.fats} 
        />

    const filteredFoodArray = foodArray.filter((item) => {

    });

    return (
        <View>
            <View style={styles.flatListContainer}>

                <FlatList 
                    data={foodArray}
                    style={styles.flatList}
                    renderItem={renderItem}
                    keyExtractor={item => item.stall + item.food}
                />

            </View>
        </View>
    );
    
}

const AllFood = ({route}) => {

    const { foodArray } = route.params;
    const renderItem = ({item}) => 
        <Result 
            stallName={item.stall} 
            foodName={item.food} 
            calories={item.calories} 
            carbs={item.carbohydrates} 
            proteins={item.proteins} 
            fats={item.fats} 
        />

    return (
        <View>
            <View style={styles.flatListContainer}>

                <FlatList 
                    data={foodArray}
                    style={styles.flatList}
                    renderItem={renderItem}
                    keyExtractor={item => item.stall + item.food}
                />

            </View>
        </View>
    );
}

const Result = ({ stallName, foodName, calories, carbs, proteins, fats }) => {

    return(
        <View style={styles.itemContainer}>

            <View style={styles.headerContainer}>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.foodName}>{foodName}</Text>
                    <Text style={styles.stallName}>{stallName}</Text>
                </View>

                <View style={styles.logFoodContainer}>
                    <TouchableOpacity>
                        <View style={styles.logFoodButton}>
                            <Text>Log Food</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                
            </View>
            
            <View style={styles.numbersContainer}>

                <View style={styles.numbersSubContainer}>
                    <Text style={styles.numberHeader}>Calories</Text>
                    <Text style={styles.numberText}>{calories} cal</Text>
                </View>
                
                <View style={styles.numbersSubContainer}>
                    <Text style={styles.numberHeader}>Carbohydrates</Text>
                    <Text style={styles.numberText}>{carbs}g</Text>
                </View>

                <View style={styles.numbersSubContainer}>
                    <Text style={styles.numberHeader}>Proteins</Text>
                    <Text style={styles.numberText}>{proteins}g</Text>
                </View>

                <View style={styles.numbersSubContainer}>
                    <Text style={styles.numberHeader}>Fats</Text>
                    <Text style={styles.numberText}>{fats}g</Text>
                </View>

            </View>
            
        </View>
    );

}

export default function DisplayFood( {isVisible, foodArray, onClose }) {
    
    return (
        <Modal animationType="slide" transparent={true} visible={isVisible}>
            <View style={styles.container}> 

                <View style={styles.header}>
                    <AntDesign.Button 
                        name="close" 
                        color= 'white' 
                        backgroundColor='#EC6337' 
                        size = {22} 
                        onPress={onClose} 
                        style={{paddingEnd: 0}} />
                </View>

                <Tab.Navigator
                    screenOptions={{
                        tabBarIndicatorStyle: {
                            backgroundColor: '#EC6337'
                        }
                    }}
                >
                    <Tab.Screen name="Recommended" component={Recommended} initialParams={{foodArray}}/>
                    <Tab.Screen name="All Food" component={AllFood} initialParams={{foodArray}}/>
                </Tab.Navigator>

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: '70%',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: 'absolute',
        bottom: 0,
    }, 
    header: {
        display: 'flex',
        height: '8%',
        backgroundColor: '#EC6337',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    flatListContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'left',
        height: '92%',
    },
    flatList: {
        display: 'flex',
    },
    itemContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 20,
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#D4D4D6',
    },
    headerTextContainer: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 10,
        width: '70%',
    },
    logFoodContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '30%',
    },
    logFoodButton: {
        borderRadius: 20,
        backgroundColor: '#EC6337',
        padding: 10,
    },
    numbersContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 15,
    },
    numbersSubContainer: {
        flexDirection: 'column',
    },
    numberHeader: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    numberText: {
        textAlign: 'center',
    },
    foodName: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    stallName: {
        fontStyle: 'italic',
        fontSize: 18,
    }
})