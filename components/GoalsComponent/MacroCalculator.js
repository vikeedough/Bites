import React, { useState, useEffect} from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';

const MacroCalculator = ({ gender, age, height, weight, activeness, setCalories, setProtein, setCarbohydrates, setFat, weightGoal }) => {

    let mbr;
    let rciActive;
    let finalRCI;
    let protein;
    let carbo;
    let fat;
  
    function calMBR() {
      if (gender === 'Male') {
        mbr = 13.397*weight + 4.799*height - 5.677*age + 88.362
      } else if (gender === 'Female') { 
        mbr = 9.247*weight + 3.098*height- 4.330*age + 447.593
      } 
    }
  
    function calRCIActive() {
      calMBR()
      switch(activeness) {
      case 'Sedentary': 
        rciActive = mbr * 1.15;
        break;
      
      case 'Light': 
        rciActive = mbr * 1.35;
        break;
  
      case 'Moderate': 
        rciActive = mbr * 1.45;
        break;
  
      case 'Heavy': 
        rciActive = mbr * 1.55;
        break;
  
      case 'Intense': 
        rciActive = mbr * 1.7;
        break;
  
      default: 
        rciActive = mbr;
        break;
      }
    }
  
    function calFinalRCI() {
      calRCIActive();
      switch(weightGoal) {
      case 'Weight gain': 
        finalRCI = rciActive * 1.2;
        break;
      
      case 'Mild weight gain': 
        finalRCI = rciActive * 1.1;
        break;
  
      case 'Maintain weight': 
        finalRCI = rciActive;
        break;
  
      case 'Mild weight loss': 
        finalRCI = rciActive * 0.9;
        break;
  
      case 'Weight loss': 
        finalRCI = rciActive * 0.8;
        break;
      }
    }
  
    function calMacros(finalRCI){
      protein = (0.15 * finalRCI) / 4;
      carbo = (0.65 * finalRCI) / 4;
      fat = (0.2 * finalRCI) / 9;
    }
  
    calFinalRCI();
    calMacros(finalRCI);
  
    setCalories(Math.round(finalRCI));
    setProtein(Math.round(protein));
    setCarbohydrates(Math.round(carbo));
    setFat(Math.round(fat));
  
  }

export default MacroCalculator;