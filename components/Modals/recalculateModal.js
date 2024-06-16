import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import SetGoalsNumberModal from '@/components/Modals/setGoalsNumberModal.js';
import SetGoalsDropdownModal from '@/components/Modals/setGoalsDropdownModal.js';
import { unloadAllAsync } from 'expo-font';

const RecalculateModal = ( { recalVisible, setRecalVisible, goalsNumberModalVisible, setGoalsNumberModalVisible, goalsDropdownModalVisible, setGoalsDropdownModalVisible, 
    updateDetail, detailType, modalType, updateGoalsFunction } ) => {

    const modalSelector = () => {
        switch (modalType) {
            case 'number':
                setGoalsNumberModalVisible(true);
                break;
            case 'dropdown':
                setGoalsDropdownModalVisible(true);
                break;
            default:
                return '';
        }
    };

    return (
        <View>
            <SetGoalsNumberModal 
                goalsNumberModalVisible={goalsNumberModalVisible}
                setGoalsNumberModalVisible={setGoalsNumberModalVisible}
                updateDetail={updateDetail}
                detailType={detailType}
                updateGoalsFunction={updateGoalsFunction}/>
            <SetGoalsDropdownModal
                goalsDropdownModalVisible={goalsDropdownModalVisible}
                setGoalsDropdownModalVisible={setGoalsDropdownModalVisible}
                updateDetail={updateDetail}
                detailType={detailType}
                updateGoalsFunction={updateGoalsFunction}/>
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
                                    <TouchableOpacity style={styles.modalYesButton} onPress={() => {setRecalVisible(false), modalSelector()}}>
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

export default RecalculateModal;