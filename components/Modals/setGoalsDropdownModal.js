import { useState }from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const SetGoalsDropdownModal = ({ goalsDropdownModalVisible, setGoalsDropdownModalVisible, updateDetail, detailType, updateGoalsFunction}) => {

    const [value, setValue] = useState(null);

    const genderData = [
        {label: "Male", value: "Male"},
        {label: "Female", value: "Female"}
    ];

    const activenessData = [
        {label: "Sedentary: Little or no exercise", value: "Sedentary"},
        {label: "Light: Exercises 1-2 times a week", value: "Light"},
        {label: "Moderate: Exercises 3-4 times a week", value: "Moderate"},
        {label: "Heavy: Exercises 5-6 times a week", value: "Heavy"},
        {label: "Intense: Intense exercise daily / physical job", value: "Intense"}
    ];

    const weightGoalData = [
        {label: "Weight Gain", value: "Weight Gain"},
        {label: "Mild Weight Gain", value: "Mild Weight Gain"},
        {label: "Maintain Weight", value: "Maintain Weight"},
        {label: "Mild Weight Loss", value: "Mild Weight Loss"},
        {label: "Weight Loss", value: "Weight Loss"}
    ];

    const dropdownDataSelector = () => {
        if (detailType === 'gender') {
            return genderData;
        } else if (detailType === 'activeness') {
            return activenessData;
        } else if (detailType === 'weight goal') {
            return weightGoalData;
        } else {
            //console.log('Dropdown selector error')
        }
    }

    const modalContainerSelector = () => {
        if (detailType === 'gender') {
            return styles.genderModalContainer;
        } else if (detailType === 'activeness') {
            return styles.activenessModalContainer;
        } else if (detailType === 'weight goal') {
            return styles.weightGoalModalContainer;
        } else {
            //console.log('modal container selector error')
        }
    }

    const modalDropdownWidthSelector = () => {
        if (detailType === 'gender') {
            return styles.genderDropdown;
        } else if (detailType === 'activeness') {
            return styles.activenessDropdown;
        } else if (detailType === 'weight goal') {
            return styles.weightGoalDropdown;
        } else {
            //console.log('modal dropdown width selector error')
        }
    }
        
      
    const DropdownComponent = () => {

        const renderItem = item => {
            return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
                {item.value === value}
            </View>
            );
        };

        return (
            <Dropdown
            style={modalDropdownWidthSelector()}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dropdownDataSelector()}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={detailType.charAt(0).toUpperCase() + detailType.slice(1)}
            value={value}
            onChange={item => {
                setValue(item.value);
            }}
            renderItem={renderItem}
            />
        );
    };

    const handleConfirm = () => {
        updateDetail(value);
        //console.log('Confirm button for Dropdown is reached');
        updateGoalsFunction(detailType, value);
        setGoalsDropdownModalVisible(false);
    };
    
    return (
        <Modal
            style={{margin: 0}}
            animationType='fade'
            visible={goalsDropdownModalVisible}
            transparent={true}
            onRequestClose={() => {setGoalsDropdownModalVisible(false)}}>
            <TouchableWithoutFeedback onPress={() => {setGoalsDropdownModalVisible(false)}}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={modalContainerSelector()}>
                            <View style={{flex: 0.3}}>
                                <Text style={styles.modalHeaderText}>Set {detailType.charAt(0).toUpperCase() + detailType.slice(1)}</Text>
                            </View>
                            <View style={styles.detailInputContainer}>
                                <View style={{alignItems: 'flex-end'}}>
                                    <DropdownComponent />
                                </View>
                                {/* <View style={{flex: 1, paddingLeft: 10}}>
                                    <Text style={{fontSize: 18}}></Text>
                                </View> */}
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
    genderModalContainer: {
        width: 250,
        height: 225,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    activenessModalContainer: {
        width: 350,
        height: 250,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    weightGoalModalContainer: {
        width: 300,
        height: 225,
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
    },
    genderDropdown: {
        margin: 16,
        height: 40,
        width: 130,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    activenessDropdown: {
        margin: 16,
        height: 60,
        width: 225,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    weightGoalDropdown: {
        margin: 16,
        height: 40,
        width: 200,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    icon: {
    marginRight: 5,
    },
    item: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    },
    textItem: {
    flex: 1,
    fontSize: 16,
    },
    placeholderStyle: {
    fontSize: 16,
    },
    selectedTextStyle: {
    fontSize: 15,
    },
    iconStyle: {
    width: 20,
    height: 20,
    },
    inputSearchStyle: {
    height: 40,
    fontSize: 16,
    },
})

export default SetGoalsDropdownModal;  