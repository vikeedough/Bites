import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import ProgressBar from 'react-native-progress/Bar';
import Icon from 'react-native-vector-icons/Entypo';

const TrophyContainer = ({trophyColor, description, progress, detailedStat, trophyTitle}) => {
    return (
        <View style={styles.containter}>
            <View style={styles.iconContainer}>
                <Icon name="trophy" size={55} color={trophyColor} />
                <Text style={styles.trophyText}>{trophyTitle}</Text>
            </View>

            <View style={styles.descriptionContainer}>
                <View style={styles.descriptionTitleContainer}>
                    <Text style={styles.descriptionText}>{description}</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.progressBarContainer}>
                        <ProgressBar
                            progress={progress} 
                            width={125}
                            height={12}
                            borderRadius={10}
                            color={'#1E90FF'}
                            animated={true}
                        />
                    </View>
                    <View style={styles.detailedStatContainer}>
                        <Text style={styles.detailedStateText}> {detailedStat} </Text>
                    </View>
                </View>
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containter: {
        width: '95%',
        maxWidth: 600,
        height: 100,
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 2, 
        borderColor: '#EC6337', 
        borderRadius: 10, 
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2, 
        shadowRadius: 2, 
        elevation: 5, 
        flexDirection: 'row',
        marginBottom: 10
    },
    iconContainer: {
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'red'
    },
    descriptionContainer: {
        flex: 0.7,
        alignItems: 'center',
        //justifyContent: 'center',
        //backgroundColor: 'blue'
    },
    descriptionText: {
        fontSize: 18
    },
    descriptionTitleContainer: {
        flex: 0.5,
        //backgroundColor: 'yellow',
        alignContent: 'center',
        justifyContent: 'center'
    },
    statsContainer: {
        flex: 0.5,
        alignContent: 'center',
        justifyContent: 'center',
        //backgroundColor: 'red',
        flexDirection: 'row'
    },
    progressBarContainer: {
        alignContent: 'flex-start',
        justifyContent: 'center'
    },
    detailedStatContainer: {
        alignContent: 'flex-end',
        justifyContent: 'center',
        marginLeft: 10
    },
    detailedStateText: {
        fontSize: 14 ,
        fontStyle: 'italic'
    },
    trophyText: {
        fontSize: 10,
        marginTop: 4,
        fontStyle: 'italic'
    }

})

export default TrophyContainer