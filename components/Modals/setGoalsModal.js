import React, { useState }from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput } from 'react-native';

const SetGoalsModal = ({ goalsVisible, setGoalsVisible, updateDetail, detailType }) => {

    const[number, setNumber] = useState(0)
    
    const handleNumberChange = (text) => {
        setNumber(text)
    }

    const handleConfirm = () => {
        const parsedNumber = parseInt(number, 10); // Convert the string to a number
        if (!isNaN(parsedNumber)) {
            updateDetail(parsedNumber); // Pass the number back to Goals component
        }
        setGoalsVisible(false);
    };

    function getDetailLabel() {
        switch (detailType) {
            case 'age':
                return 'years old';
            case 'weight':
                return 'kg';
            case 'height':
                return 'cm';
            default:
                return '';
        }
    };

    
    return (
        <Modal
            style={{margin: 0}}
            animationType='fade'
            visible={goalsVisible}
            transparent={true}
            onRequestClose={() => {setGoalsVisible(false)}}>
            <TouchableWithoutFeedback onPress={() => {setGoalsVisible(false)}}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={{flex: 0.3}}>
                                <Text style={styles.modalHeaderText}>Set {detailType.charAt(0).toUpperCase() + detailType.slice(1)}</Text>
                            </View>
                            <View style={styles.detailInputContainer}>
                                <View style={{alignItems: 'flex-end'}}>
                                <TextInput style={styles.numberStyle}
                                    keyboardType = "numeric"
                                    value = {number}
                                    onChangeText={handleNumberChange}/>
                                </View>
                                <View style={{flex: 1, paddingLeft: 10}}>
                                    <Text style={{fontSize: 18}}>{getDetailLabel()}</Text>
                                </View>
                            </View>
                            <View style={styles.confirmButtonContainer}>
                                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>Confirm</Text>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        width: 280,
        height: 190,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    modalHeaderText: {
        fontSize: 28,
        fontWeight: 'bold',
        paddingTop: 5
    },
    numberStyle: {
        width: 50,
        height: 40,
        borderWidth: 1,
        borderRadius: 6,
        padding: 6,
        textAlign: 'center',
        justifyContent:'center',
        fontSize: 20
    },
    detailInputContainer: {
        flex: 0.50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'green'
    },
    confirmButtonContainer: {
        flex: 0.20, 
        alignItems: 'flex-end',
        paddingRight: 5, 
        justifyContent: 'center'
    },
    confirmButton: {
        width: 80,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        backgroundColor: '#ff924a'
    }
})

export default SetGoalsModal;