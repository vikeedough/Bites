import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import RecalculateModal from '@/components/Modals/recalculateModal.js';
import SetGoalsModal from '@/components/Modals/setGoalsModal.js';


export default function Goals() {

  const [age, onChangeAge] = React.useState(0);
  const [weight, onChangeWeight] = React.useState('');
  const [height, onChangeHeight] = React.useState('');

  const [warningModalVisibile, setWarningModalVisible] = useState(false);
  const [ageModalVisibile, setAgeModalVisible] = useState(false);

  return (
    <View style={styles.container}>
        <RecalculateModal 
          recalVisible={warningModalVisibile}
          setRecalVisible={setWarningModalVisible}
          goalsVisible={ageModalVisibile}
          setGoalsVisible={setAgeModalVisible}/>
        <View style={styles.detailContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textLayout}>Age</Text>
          </View>
          <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setWarningModalVisible(true)}>
            <Text style={styles.buttonText}>{age}g</Text>
          </TouchableOpacity>
          </View>
        </View>
        

        {/* <View style={styles.detailContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textLayout}>Height</Text>
          </View>
          <View style={styles.buttonContainer}>
          <TextInput
            style={styles.ageInput}
            keyboardType='numeric'
            onChangeText={onChangeHeight}
            value={height}        
          /> 
          </View>
        </View>

        <View style={styles.detailContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textLayout}>Weight</Text>
          </View>
          <View style={styles.buttonContainer}>
          <TextInput
            style={styles.ageInput}
            keyboardType='numeric'
            onChangeText={onChangeWeight}
            value={age}        
          /> 
          </View>
        </View> */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: 'red'
  },
  detailContainer: {
    flex: 0.05,
    flexDirection: 'row',
    padding: 25,
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  textInput: {
    padding: 10,
    width: 40
  },
  textLayout: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonText: {
    fontSize: 18
  },
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
});