import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';


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
        {item.value === value && (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"   
            size={20}
          />
        )}
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
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Select..."
      searchPlaceholder="Search..."
      value={value}
      onChange={item => {
        setValue(item.value);
      }}
      renderLeftIcon={() => (
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      )}
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


export default function Food() {
  return (
    <View style={styles.container}>
      <View style={styles.foodTitleContainer}>
        <Text style={styles.foodTitleText}>Food Name</Text>
      </View>
      <View style={styles.mealTypeContainer}>
        <View style={{flex: 1}}>
          <Text style={styles.mealTypeText}>Meal Type</Text>
        </View>
        <View style={{flex: 1}}>
          <DropdownComponent/ >
        </View>
      </View>
      <View style={styles.numServingsContainer}>
        <View style={{flex: 1}}>
          <Text style={styles.mealTypeText}>Number of Servings</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
            <NumberInput />
        </View>
      </View>
      <View style={styles.totalMacrosContainer}>
        <View style={styles.macrosContainer}>
          <TouchableOpacity>
            <Text style={styles.macroNumber}>0g</Text>
          </TouchableOpacity>
          <Text style={styles.macrosText}>Calories</Text>
        </View>
 
        <View style={styles.macrosContainer}>
          <TouchableOpacity>
            <Text style={styles.macroNumber}>0g</Text>
          </TouchableOpacity>
          <Text style={styles.macrosText}>Protein</Text>
        </View>


        <View style={styles.macrosContainer}>
          <TouchableOpacity>
            <Text style={styles.macroNumber}>0g</Text>
          </TouchableOpacity>
          <Text style={styles.macrosText}>Fat</Text>
        </View>


        <View style={styles.macrosContainer}>
          <TouchableOpacity>
            <Text style={styles.macroNumber}>0g</Text>
          </TouchableOpacity>
          <Text style={styles.macrosText}>Carbohydrates</Text>
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
    backgroundColor: '#e5cbaa',
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
    borderBottomWidth: 0.5
  },
  numServingsContainer: {
    flexDirection: 'row',
    flex: 0.15,
    //backgroundColor: 'green',
    alignItems: 'center',
    borderBottomWidth: 0.5
  },
  mealTypeText: {
    fontSize: 20,
    paddingLeft: 15,
    //backgroundColor: 'red',
  },
  dropdown: {
    paddingLeft: 25,
    height: 40,
    width: 150,
    backgroundColor: 'white',
    borderRadius: 12,
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
    padding: 17,
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
    width: 75,
    height: 30,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center'
  },
  totalMacrosContainer: {
    flex: 0.15,
    flexDirection: 'row',
    //backgroundColor: 'yellow'
    borderBottomWidth: 0.5
  },
  macrosContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macrosText: {
    fontSize: 12,
    paddingTop: 5
  },
  macroNumber: {
    fontSize: 20
  },
  barGraphContainer: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'center'
  }
});





