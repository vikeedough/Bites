import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import MacroButton from '@/components/MacroButton.js';

export default function Food() {

  const [calories, setCalories] = React.useState(0);
  const [protein, setProtein] = React.useState(0);
  const [fat, setFat] = React.useState(0);
  const [carbohydrates, setCarbohydrates] = React.useState(0);

  const data = [
    {label: "Breakfast", value: "Breakfast"},
    {label: "Lunch", value: "Lunch"},
    {label: "Dinner", value: "Dinner"},
    {label: "Others", value: "Others"}
  ]
  
  const DropdownComponent = () => {
  
    const [value, setValue] = useState(null);
  
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
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Meal Type"
        value={value}
        onChange={item => {
          setValue(item.value);
        }}
        renderItem={renderItem}
      />
    );
  };
  
  const NumberInput = () => {
    const[number, setNumber] = useState('')
  
  
    const handleNumberChange = (text) => {
      setNumber(text)
    }
  
  
    return(
      <TextInput style={styles.numberStyle}
      keyboardType = "numeric"
      value = {number}
      onChangeText={handleNumberChange}/>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.foodTitleContainer}>
        <Text style={styles.foodTitleText}>Food Name</Text>
      </View>
      <View style={styles.mealTypeContainer}>
        <View style={styles.mealTypeTextContainer}>
          <Text style={styles.mealTypeText}>Meal Type</Text>
        </View>
        <View style={styles.mealTypeDropdownContainer}>
          <DropdownComponent />
        </View>
      </View>
      <View style={styles.numServingsContainer}>
        <View style={styles.numServingsTextContainer}>
          <Text style={styles.mealTypeText}>Number of Servings</Text>
        </View>
        <View style={styles.numServingsTextInputContainer}>
          <NumberInput />
        </View>
      </View>
      <View style={styles.totalMacrosContainer}>
        <View style={styles.macrosContainer}>
          <TouchableOpacity>
            <Text style={styles.macroNumber}>{calories}</Text>
          </TouchableOpacity>
            <Text style={styles.macrosText}>Calories</Text>
        </View>

        <View style={styles.macrosContainer}>
          <TouchableOpacity>
            <Text style={styles.macroNumber}>{carbohydrates}g</Text>
          </TouchableOpacity>
            <Text style={styles.macrosText}>Carbohydrates</Text>
        </View>

        <View style={styles.macrosContainer}>
          <TouchableOpacity>
            <Text style={styles.macroNumber}>{protein}g</Text>
          </TouchableOpacity>
            <Text style={styles.macrosText}>Protein</Text>
        </View>

        <View style={styles.macrosContainer}>
          <TouchableOpacity>
            <Text style={styles.macroNumber}>{fat}g</Text>
          </TouchableOpacity>
            <Text style={styles.macrosText}>Fat</Text>
        </View>
      </View>

      <View style={styles.barGraphContainer}>
        <Text>Bar Graph</Text>
      </View>
     
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  foodTitleContainer: {
    flex: 0.2,
    justifyContent: 'center',
    //backgroundColor: 'red',
    borderBottomWidth: 0.5,
  },
  foodTitleText: {
    fontSize: 35,
    fontWeight: 'bold',
    paddingLeft: 20,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    flex: 0.15,
    //backgroundColor: 'blue',
    alignItems: 'center',
  },
  mealTypeTextContainer: {
    flex: 1, 
    alignItems: 'flex-start',
    paddingLeft: 25
  },
  mealTypeDropdownContainer: {
    flex: 1, 
    alignItems: 'flex-end',
    paddingRight: 25,
  },
  numServingsTextContainer: {
    flex: 1, 
    alignItems: 'flex-start',
    paddingLeft: 25
  },
  numServingsTextInputContainer: {
    flex: 1, 
    alignItems: 'flex-end',
    paddingRight: 25
  },
  numServingsContainer: {
    flexDirection: 'row',
    flex: 0.15,
    //backgroundColor: 'green',
    alignItems: 'center',
  },
  mealTypeText: {
    fontSize: 20,
    width: 100,
    //backgroundColor: 'red',
  },
  dropdown: {
    height: 40,
    width: 140,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#EC6337'
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  numberStyle: {
    width: 70,
    height: 30,
    borderWidth: 1,
    borderRadius: 6,
  },
  totalMacrosContainer: {
    flex: 0.15,
    flexDirection: 'row',
    //backgroundColor: 'yellow'
  },
  macrosContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macrosText: {
    fontSize: 12,
    paddingTop: 5,
    fontWeight: 'bold'
  },
  macroNumber: {
    fontSize: 20,
    color: '#EC6337'
  },
  barGraphContainer: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'center'
  }
});





