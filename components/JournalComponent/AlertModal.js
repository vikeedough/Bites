import React, { useState, useEffect }from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';

export default function AlertModal({ alertModal, setAlertModal, alertType}) {

    return (
        <Modal
            style={{margin: 0}}
            animationType='fade'
            visible={alertModal}
            transparent={true}
            onRequestClose={() => {setAlertModal(false)}}>
            <TouchableWithoutFeedback onPress={() => {setAlertModal(false)}}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.textContainer}>
                                <Text style={styles.textFormat}>Please select {alertType}</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={() => setAlertModal(false)}>
                                    <Text>Ok</Text>
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
        width: 275,
        height: 100,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    textContainer: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'red'
    },
    textFormat: {
        fontSize: 20, 
        fontWeight: 'bold'
    },
    buttonContainer: {
        flex: 0.5,
        //backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10

    },
    button: {
        width: 60,
        height: 30,
        borderRadius: 5,
        backgroundColor: '#EC6337',
        justifyContent: 'center',
        alignItems: 'center',
    }
})