import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';

const SetGoalsModal = ({ goalsVisible, setGoalsVisible }) => {
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
                            <Text>Testing</Text>
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
        width: 300,
        height: 300,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
})

export default SetGoalsModal;