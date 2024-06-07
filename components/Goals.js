import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';


export default function Goals() {

    const ModalDetails = ({name}) => {
        return (
            <Modal
                style={{margin: 0}}
                animationType='fade'
                visible={ageModalVisibile}
                transparent={true}
                onRequestClose={() => setAgeModalVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setAgeModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.modalContentTextContainer}>
                                  <Text style={styles.modalContentText}>Are you sure? Changing this will cause your macros to be recalculated.</Text>
                                </View>
                                <View style={styles.modalButtonContainer}>
                                  <View style={styles.modalCancelButton}>
                                    <TouchableOpacity>
                                      <Text>Cancel</Text>
                                    </TouchableOpacity>
                                  </View >
                                  <View style={styles.modalYesButton}>
                                    <TouchableOpacity>
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

  const [age, onChangeAge] = React.useState(0);
  const [weight, onChangeWeight] = React.useState('');
  const [height, onChangeHeight] = React.useState('');

  const [ageModalVisibile, setAgeModalVisible] = useState(false);

  return (
    <View style={styles.container}>
        <View style={styles.detailContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textLayout}>Age</Text>
          </View>
          <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setAgeModalVisible(true)}>
            <Text style={styles.buttonText}>{age}g</Text>
          </TouchableOpacity>
          </View>
        </View>
        <ModalDetails 
            name="Goals"/>

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
    height: 150,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  modalContentTextContainer: {
    flex: 0.4,
    backgroundColor: 'green',
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
    paddingTop: 25,
    //backgroundColor: 'blue'
  },
  modalCancelButton: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',

  },
  modalYesButton: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'
  }
});