import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import RecalculateModal from '@/components/Modals/recalculateModal.js';
import SetGoalsModal from '@/components/Modals/setGoalsModal.js';


export default function Goals() {

  const [age, setAge] = React.useState(0);
  const [height, setHeight] = React.useState('');
  const [weight, setWeight] = React.useState('');
  

  const [warningModalVisibile, setWarningModalVisible] = useState(false);
  const [ageModalVisibile, setAgeModalVisible] = useState(false);
  const [currentDetail, setCurrentDetail] = useState('');

  function updateDetail(newDetail) {
    if (currentDetail === 'age') {
      setAge(newDetail);
    } else if (currentDetail === 'height') {
      setHeight(newDetail);
    } else if (currentDetail === 'weight') {
      setWeight(newDetail);
    } 
  };

  const openDetailModal = (detail) => {
    setCurrentDetail(detail);
    setWarningModalVisible(true);
  };


  return (
    <View style={styles.container}>
        <RecalculateModal 
          recalVisible={warningModalVisibile}
          setRecalVisible={setWarningModalVisible}
          goalsVisible={ageModalVisibile}
          setGoalsVisible={setAgeModalVisible}
          updateDetail={updateDetail}
          detailType={currentDetail}/>

        <View style={styles.detailContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textLayout}>Age</Text>
          </View>
          <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => openDetailModal('age')}>
            <Text style={styles.buttonText}>{age} years old</Text>
          </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.detailContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textLayout}>Height</Text>
          </View>
          <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => openDetailModal('height')}>
            <Text style={styles.buttonText}>{height} cm</Text>
          </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textLayout}>Weight</Text>
          </View>
          <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => openDetailModal('weight')}>
            <Text style={styles.buttonText}>{weight} kg</Text>
          </TouchableOpacity>
          </View>
        </View>
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
    borderBottomWidth: 0.5
    //backgroundColor: 'red'
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
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
    fontSize: 18,
    color: '#ff924a'
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