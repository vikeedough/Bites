import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
// import Food from "@/components/Food.js"

export default function Journal() {
  return (
      <View style={styles.container}>
        <View style={[styles.border, styles.container]}>
          <Text style={styles.today}>Today</Text>
        </View>
        
        <View style={[styles.border, styles.container]}>
          <Text style={styles.barGraph}>Bar Graph</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.border}>
            <Text style={styles.text}>Breakfast</Text>
          </View>

          <View style={styles.border}>
            <Text style={styles.text}>Lunch</Text>
          </View>

          <View style={styles.border}>
            <Text style={styles.text}>Dinner</Text>
          </View>

          <View style={styles.border}>
            <Text style={styles.text}>Snacks</Text>
          </View>
        </View> 
        
        <View style={[styles.buttonContainer, styles.container]}>
          <TouchableOpacity style={styles.button}>
            <Text>Add Food</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
}

{/* <View style={styles.button}>
  <Button title="Add Food"/>
</View> */}

//onPress={() => navigation.navigate("Food")}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  today: {
    textAlign: 'center',
    fontSize: 20,
    padding: 8
  },
  barGraph: {
    fontSize: 100,
    textAlign: 'center',
    padding: 8
  },
  text: {
    padding: (8, 8, 20),
    fontSize: 20
  },
  border: {
    borderBottomWidth: 1,
    borderColor: 'black'
  },
  button: {
    backgroundColor: '#00bfff',
    height: '25%',
    width: '25%',
    position: 'fixed',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});