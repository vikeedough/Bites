import React, { useState, useEffect }from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarModal({ calendarModal, setCalendarModal, onDayPress }) {

    return (
        <Modal
            style={{margin: 0}}
            animationType='fade'
            visible={calendarModal}
            transparent={true}
            onRequestClose={() => {setCalendarModal(false)}}>
            <TouchableWithoutFeedback onPress={() => {setCalendarModal(false)}}>
                <View style={styles.calendarModalContainer}>
                    <TouchableWithoutFeedback>
                        <View>
                            <Calendar
                                onDayPress={onDayPress}/>
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
        paddingTop: 10,
        backgroundColor: 'rgba(0, 0, 0, 0)'
    }
})