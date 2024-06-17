import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import Food from "@/components/Food.js"

export default function Journal({navigation}) {

  



  return (
    <View style={{flex: 1}}>
      <View style={styles.todayContainer}>
        <Text style={{fontSize: 18}}>Today</Text>
      </View>

      <View style={styles.barGraphContainer}>
        <Text style={{fontSize: 20}}>Bar Graph</Text>
      </View>

      <View style={styles.BodyContainer}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>

          <View style ={styles.MealContainer}>
            <View style={styles.MealHeader}>
              <View style={{flex: 1}}>
                <Text style={styles.MealTitle}>Breakfast</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.CalorieTitle}>Calories: 0</Text>
              </View>
            </View>
            <ScrollView contentContainerStyle={{flex: 0.8}}>
              <Text></Text>
            </ScrollView>
          </View>

          <View style ={styles.MealContainer}>
            <View style={styles.MealHeader}>
              <View style={{flex: 1}}>
                <Text style={styles.MealTitle}>Lunch</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.CalorieTitle}>Calories: 0</Text>
              </View>
            </View>
            <View style ={{flex: 0.8}}>
              <Text></Text>
            </View>
          </View>

          <View style ={styles.MealContainer}>
            <View style={styles.MealHeader}>
              <View style={{flex: 1}}>
                <Text style={styles.MealTitle}>Dinner</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.CalorieTitle}>Calories: 0</Text>
              </View>
            </View>
            <View style ={{flex: 0.8}}>
              <Text></Text>
            </View>
          </View>

          <View style ={styles.MealContainer}>
            <View style={styles.MealHeader}>
              <View style={{flex: 1}}>
                <Text style={styles.MealTitle}>Others</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.CalorieTitle}>Calories: 0</Text>
              </View>
            </View>
            <View style ={{flex: 0.8}}>
              <Text></Text>
            </View>
          </View>
          
        </ScrollView>
      </View>

      <View style={styles.ButtonContainer}>
        <TouchableOpacity style={styles.AddFoodButton} onPress={()=> navigation.navigate(Food)}>
          <Text>Add Food</Text>
        </TouchableOpacity>
      </View>
    </View>

  )  
}

const styles = StyleSheet.create({
  todayContainer: {
    flex: 0.05,
    borderBottomWidth: 0.6,
    borderTopWidth: 0.6,
    //backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center'
  },
  barGraphContainer: {
    flex: 0.15,
    borderBottomWidth: 0.6,
    //backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center'
  },
  BodyContainer: {
    flex: 0.70,
    //backgroundColor: 'yellow',
  },
  ButtonContainer: {
    flex: 0.10,
    borderBottomWidth: 0.6,
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
    backgroundColor: '#EC6337',
  },
  MealContainer: {
    flex: 0.25,
    borderBottomWidth: 0.6,
  },
  MealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  CalorieTitle: {
    fontSize: 18,
    fontWeight: 'bold', 
    textAlign: 'right',
    paddingRight: 10
  },
  MealHeader: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    borderBottomWidth: 0.6,
    //backgroundColor: 'red'
  }
});
