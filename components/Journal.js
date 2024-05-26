import React from 'react';
import { Text, View, StyleSheet, Button } from "react-native";
// import Food from "@/components/Food.js"

export default function Journal() {
  return (
      <View>
        <View style={styles.border}>
          <Text style={styles.today}>Today</Text>
        </View>
        
        <View style={styles.border}>
          <Text style={styles.barGraph}>Bar Graph</Text>
        </View>

        <View >
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

        <View style={styles.button}>
          <Button title="Add Food"/>
        </View>
  
      </View>
    );
}

//onPress={() => navigation.navigate("Food")}

const styles = StyleSheet.create({
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
    height: '22%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  }
});