import React, { useState, useEffect }from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function DeleteEntry({ deleteEntryModal, setDeleteEntryModal, deleteEntry, deleteEntryMealType, deleteEntryFood }) {

    const handleOnYesPress = async () => {
        console.log("In handleOnYesPress")
        await deleteEntry(deleteEntryMealType, deleteEntryFood);
        setDeleteEntryModal(false)
    }

    return (
        <Modal
            style={{margin: 0}}
            animationType='fade'
            visible={deleteEntryModal}
            transparent={true}
            onRequestClose={() => {setDeleteEntryModal(false)}}>
            <TouchableWithoutFeedback onPress={() => {setDeleteEntryModal(false)}}>
                <View style={styles.calendarModalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.modalContentTextContainer}>
                                <Text style={styles.modalContentText}>Delete entry?</Text>
                            </View>
                            <View style={styles.modalButtonContainer}>
                                <View style={styles.modalCancelButtonContainer}>
                                    <TouchableOpacity style={styles.modalCancelButton} onPress={() => {setDeleteEntryModal(false)}}>
                                        <Text>Cancel</Text>
                                    </TouchableOpacity>
                                </View >
                                <View style={styles.modalYesButtonContainer}>
                                    <TouchableOpacity style={styles.modalYesButton} onPress={() => handleOnYesPress()}>
                                        <Text>Yes</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
  
            </TouchableWithoutFeedback>

        </Modal>
    )
}

const styles = StyleSheet.create({
    calendarModalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        width: 225,
        height: 125,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    modalContentTextContainer: {
        flex: 0.4,
        //backgroundColor: 'green',
        padding: 5
    },
    modalContentText: {
        fontSize: 25,
        fontWeight: 'bold',
        //backgroundColor: 'green'
    },
    modalButtonContainer: {
        flex: 0.4,
        flexDirection: 'row',
        justifyContent: 'center',

        //backgroundColor: 'yellow'
    },
    modalCancelButtonContainer: {
        flex: 1,
        alignItems: 'flex-start',
        //backgroundColor: 'blue',
        justifyContent: 'center',
        paddingLeft: 25
    },
    modalYesButtonContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        //backgroundColor: 'red',
        paddingRight: 30
    },
    modalCancelButton: {
        height: 30,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: '#807F7F'
    },
    modalYesButton: {
        height: 30,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: '#ff924a'
    }
})