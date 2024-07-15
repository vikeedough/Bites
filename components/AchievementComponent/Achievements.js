import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import TrophyContainer from "@/components/AchievementComponent/TrophyContainer.js";
import {firebaseApp, firebaseAuth, firebaseDb} from '../../firebaseConfig';
import { collection, getDoc, onSnapshot, doc, getDocs, updateDoc, setDoc, getDocsFromCache } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Entypo';

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;

export default function Achievements() {

    const [totalMealsLogged, setTotalMealsLogged] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);

    useEffect(() => {

        const fetchData = async () => {
    
            try {
              const docRef = doc(db, 'users', auth.currentUser.uid);
    
              const unsubscribeMealLogs = onSnapshot(docRef, async (doc) => {
                const foodTest = doc.data().numberOfFoodLogs;
                setTotalMealsLogged(foodTest);

                const currAchievements = doc.data().Achievements;
                const copyOfAchievements = [...currAchievements];

                if (foodTest >= 7 && !copyOfAchievements.includes("Meal Rookie")) {
                    const newAchievements = [...copyOfAchievements, "Meal Rookie"];

                    await updateDoc(docRef, {
                        Achievements : newAchievements
                    });
                } 

                if (foodTest >= 14 && !copyOfAchievements.includes("Dedicated Logger")) {
                    const newAchievements = [...copyOfAchievements, "Dedicated Logger"];

                    await updateDoc(docRef, {
                        Achievements : newAchievements
                    });
                }

                if (foodTest >= 30 && !copyOfAchievements.includes("Logging Maestro")) {
                    const newAchievements = [...copyOfAchievements, "Logging Maestro"];

                    await updateDoc(docRef, {
                        Achievements : newAchievements
                    });
                }

              })

              const unsubscribePosts = onSnapshot(docRef, async (doc) => {
                const postsTest = doc.data().numberOfPosts;
                setTotalPosts(postsTest);

                const currAchievements = doc.data().Achievements;
                const copyOfAchievements = [...currAchievements];
                
                if (postsTest >= 10 && !copyOfAchievements.includes("Meal Poster")) {
                    const newAchievements = [...copyOfAchievements, "Meal Poster"];

                    await updateDoc(docRef, {
                        Achievements : newAchievements
                    });
                } 

                if (postsTest >= 20 && !copyOfAchievements.includes("Meal Picasso")) {
                    const newAchievements = [...copyOfAchievements, "Meal Picasso"];

                    await updateDoc(docRef, {
                        Achievements : newAchievements
                    });
                }

                if (postsTest >= 50 && !copyOfAchievements.includes("Influencer")) {
                    const newAchievements = [...copyOfAchievements, "Influencer"];

                    await updateDoc(docRef, {
                        Achievements : newAchievements
                    });
                }

              })

              return () => {
                unsubscribeMealLogs();
                unsubscribePosts();
              };
              
            }   catch (error) {
                console.log("Unable to retrieve data " + error)
            }
        }

        fetchData();
    
    }, [])

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.containter} >
            <View style={styles.categoryContainer}>
                <View style={styles.categoryTitleContainer}>
                    <Text style={styles.categoryTitle}>Meal Log Achievements</Text>
                    <Icon name="book" size={40} color='white' />
                </View>
                <View style={styles.contentContainer}>
                    <TrophyContainer 
                            trophyColor={"#CD7F32"}
                            description={"Log meals for 7 days!"}
                            progress={(totalMealsLogged / 7) > 1 ? 1 : Math.round(totalMealsLogged / 7 * 100) / 100}
                            detailedStat={`${totalMealsLogged > 7 ? 7 : totalMealsLogged} / 7`}
                            trophyTitle={"Meal Rookie"}/>

                    <TrophyContainer 
                        trophyColor={"#C0C0C0"}
                        description={"Log meals for 14 days!"}
                        progress={(totalMealsLogged / 14) > 1 ? 1 : Math.round(totalMealsLogged / 14 * 100) / 100}
                        detailedStat={`${totalMealsLogged > 14 ? 14 : totalMealsLogged} / 14`}
                        trophyTitle={"Dedicated Logger"}/>

                    <TrophyContainer 
                        trophyColor={"#FFD700"}
                        description={"Log meals for 30 days!"}
                        progress={(totalMealsLogged / 30) > 1 ? 1 : Math.round(totalMealsLogged / 30 * 100) / 100}
                        detailedStat={`${totalMealsLogged > 30 ? 30 : totalMealsLogged} / 30`}
                        trophyTitle={"Logging Maestro"}/>  
                </View>             
            </View>

            <View style={styles.categoryContainer}>
                <View style={styles.categoryTitleContainer}>
                    <Text style={styles.categoryTitle}>Meal Post Achievements</Text>
                    <Icon name="camera" size={40} color='white' />
                </View>
                <View style={styles.contentContainer}>
                    <TrophyContainer 
                    trophyColor={"#CD7F32"}
                    description={"Post 10 meals!"}
                    progress={(totalPosts / 10) > 1 ? 1 : Math.round(totalPosts / 10 * 100) / 100}
                    detailedStat={`${totalPosts > 10 ? 10 : totalPosts} / 10`}
                    trophyTitle={"Meal Poster"}/>

                    <TrophyContainer 
                        trophyColor={"#C0C0C0"}
                        description={"Post 20 meals!"}
                        progress={(totalPosts / 20) > 1 ? 1 : Math.round(totalPosts / 20 * 100) / 100}
                        detailedStat={`${totalPosts > 20 ? 20 : totalPosts} / 20`}
                        trophyTitle={"Meal Picasso"}/>

                    <TrophyContainer 
                        trophyColor={"#FFD700"}
                        description={"Post 50 meals!"}
                        progress={(totalPosts / 50) > 1 ? 1 : Math.round(totalPosts / 50 * 100) / 100}
                        detailedStat={`${totalPosts > 50 ? 50 : totalPosts} / 50`}
                        trophyTitle={"Influencer"}/>
                </View>             
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#F4F4F6'
    },
    containter: {
        alignItems: 'center',
        padding: 20
    },
    categoryContainer: {
        flex: 1,
        width: '100%',
        maxWidth: 600,
        height: 'auto',
        //paddingTop: 10,
        backgroundColor: 'white',
        //borderWidth: 2, 
        borderColor: '#EC6337', 
        borderRadius: 10, 
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2, 
        shadowRadius: 2, 
        elevation: 1, 
        //backgroundColor: 'blue'
    },
    categoryTitleContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EC6337',
        borderTopLeftRadius: 8, 
        borderTopRightRadius: 8,  
        flexDirection: 'row',
        padding: 10
    },
    contentContainer: {
        width: '100%',
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
        //backgroundColor: 'yellow'
    },
    categoryTitle: {
        fontSize: 15,
        color: 'white',
        fontWeight: 'bold',
        paddingRight: 10
    }

})