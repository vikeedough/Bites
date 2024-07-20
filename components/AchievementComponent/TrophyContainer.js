import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert} from "react-native";
import ProgressBar from 'react-native-progress/Bar';
import Icon from 'react-native-vector-icons/Entypo';
import { firebaseAuth, firebaseDb } from '../../firebaseConfig';
import { getDoc, doc, setDoc } from 'firebase/firestore';

const auth = firebaseAuth;
const db = firebaseDb;

const TrophyContainer = ({trophyColor, description, progress, detailedStat, trophyTitle, onAchievementSelect, selectedAchievement}) => {

    const [currAchievements, setCurrAchievements] = useState([]);
    const [currDisplayed, setCurrDisplayed] = useState('');

    const findAchievements = async () => {
        const findUser = (await getDoc(doc(db, 'users', auth.currentUser.uid))).data();
        setCurrAchievements(findUser.Achievements);
        setCurrDisplayed(findUser.selectedAchievement);
        console.log(currAchievements);
    }

    const selectAchievement = () => {
        if (currAchievements.includes(trophyTitle)) {

            if (trophyTitle === currDisplayed) {
                Alert.alert(
                    "Remove achievement",
                    "Are you sure you want to stop displaying this achievement on your profile?",
                    [
                        {
                            text: "No",
                            style: "cancel"
                        },
                        {
                            text: "Yes",
                            onPress: async () => {
                                await setDoc(doc(db, "users", auth.currentUser.uid), 
                                    { selectedAchievement: '' }, { merge: true}
                                )
                                setCurrDisplayed('');
                                onAchievementSelect('');
                            },
                            style: "destructive"
                        }
                    ]
                );
            } else {
                Alert.alert(
                    "Display achievement",
                    "Do you want to display this achievement on your profile?",
                    [
                        {
                            text: "No",
                            style: "cancel"
                        },
                        {
                            text: "Yes",
                            onPress: async () => {
                                await setDoc(doc(db, "users", auth.currentUser.uid), 
                                    { selectedAchievement: trophyTitle }, { merge: true}
                                )
                                setCurrDisplayed(trophyTitle);
                                onAchievementSelect(trophyTitle);
                            },
                            style: "destructive"
                        }
                    ]
                );
            }

        }
    }

    useEffect(() => {
        findAchievements();
    }, [selectedAchievement]);

    return (
        <TouchableOpacity style={styles.containerStyle} onPress={selectAchievement}>
            <View style={styles.iconContainer}>
                <Icon name="trophy" size={50} color={trophyColor} />
            </View>

            <View style={styles.descriptionContainer}>
                <View style={styles.descriptionTitleContainer}>
                    <View style={styles.trophyTitleContainer}>
                        <Text style={styles.trophyText}>{trophyTitle}</Text>
                        {
                            selectedAchievement === trophyTitle
                            ?
                            <View style={styles.selectionContainer}>
                                <Text style={styles.selectedText}>Selected</Text>
                            </View>
                            :
                            <View></View>
                        }
                    </View>
                    <Text style={styles.descriptionText}>{description}</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.progressBarContainer}>
                        <ProgressBar
                            progress={progress} 
                            width={160}
                            height={15}
                            borderRadius={10}
                            color={'#F6B19B'}
                            animated={true}
                        />
                    </View>
                    <View style={styles.detailedStatContainer}>
                        <Text style={styles.detailedStateText}> {detailedStat} </Text>
                    </View>
                </View>
                
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        width: '100%',
        maxWidth: 600,
        height: 90,
        padding: 10,
        backgroundColor: 'white',
        borderTopWidth: 1, 
        borderColor: '#F4F4F6',  
        flexDirection: 'row',
        marginBottom: 10
    },
    iconContainer: {
        flex: 0.25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    descriptionContainer: {
        flex: 0.75,
        gap: 20,
    },
    trophyTitleContainer: {
        flexDirection: 'row',
        gap: 5,
    },
    descriptionText: {
        fontSize: 14,
        color: '#828282',
    },
    descriptionTitleContainer: {
        flex: 0.5,
        marginTop: 10,
    },
    statsContainer: {
        flex: 0.5,
        flexDirection: 'row',
    },
    progressBarContainer: {
        alignContent: 'flex-start',
        justifyContent: 'center'
    },
    detailedStatContainer: {
        justifyContent: 'center',
        marginLeft: 5
    },
    detailedStateText: {
        fontSize: 14 ,
        color: '#828282'
    },
    trophyText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    selectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 20,
        backgroundColor: '#FFA973',
    },
    selectedText: {
        fontSize: 12,
        color: 'white',
        alignSelf: 'center'
    }

})

export default TrophyContainer