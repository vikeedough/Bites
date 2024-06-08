import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import SetGoalsModal from '@/components/Modals/setGoalsModal.js';

const RecalculateModal = ({ recalVisible, setRecalVisible, goalsVisible, setGoalsVisible}) => {
    return (
        <View>
            <SetGoalsModal 
            goalsVisible={goalsVisible}
            setGoalsVisible={setGoalsVisible}/>
            <Modal
                style={{margin: 0}}
                animationType='fade'
                visible={recalVisible}
                transparent={true}
                onRequestClose={() => {setRecalVisible(false)}}>
                <TouchableWithoutFeedback onPress={() => {setRecalVisible(false)}}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.modalContentTextContainer}>
                                <Text style={styles.modalContentText}>Are you sure? Changing this will cause your macros to be recalculated.</Text>
                                </View>
                                <View style={styles.modalButtonContainer}>
                                <View style={styles.modalCancelButtonContainer}>
                                    <TouchableOpacity style={styles.modalCancelButton} onPress={() => {setRecalVisible(false)}}>
                                    <Text>Cancel</Text>
                                    </TouchableOpacity>
                                </View >
                                <View style={styles.modalYesButtonContainer}>
                                    <TouchableOpacity style={styles.modalYesButton} onPress={() => {setRecalVisible(false), setGoalsVisible(true)}}>
                                        <Text>Yes</Text>
                                    </TouchableOpacity>
                                </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
        
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
    width: 300,
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
    fontSize: 15,
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
    borderWidth: 0.5,
    backgroundColor: '#807F7F'
    },
    modalYesButton: {
    height: 30,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 0.5,
    backgroundColor: '#48d1cc'
    }
})

export default RecalculateModal;