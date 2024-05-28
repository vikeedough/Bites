import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
// import Food from "@/components/Food.js"

export default function Journal() {
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={{flex: 1}}>
        <View style={styles.todayContainer}>
          <Text style={{fontSize: 20}}>Today</Text>
        </View>

        <View style={styles.barGraphContainer}>
          <Text style={{fontSize: 20}}>Bar Graph</Text>
        </View>

        <View style={styles.BodyContainer}>
          <Text>Body</Text>
        </View>

        <View style={styles.ButtonContainer}>
          <TouchableOpacity style={styles.AddFoodButton}>
            <Text>Add Food</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    
    

  )  
}

const styles = StyleSheet.create({
  todayContainer: {
    flex: 0.05,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    //backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center'
  },
  barGraphContainer: {
    flex: 0.30,
    borderBottomWidth: 1,
    //backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center'
  },
  BodyContainer: {
    flex: 0.55,
    borderBottomWidth: 1,
    //backgroundColor: 'yellow',
  },
  ButtonContainer: {
    flex: 0.10,
    borderBottomWidth: 1,
    //backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center'
  },
  AddFoodButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#48d1cc',
  },
});
