import React, { useEffect, useState } from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import { Text, View, StyleSheet, TextInput } from "react-native";
import { firebaseAuth, firebaseDb } from '@/firebaseConfig';
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import DisplayFood from '@/components/Modals/DisplayFood.js';

const auth = firebaseAuth;
const db = firebaseDb;

export default function Map() {

  const [text, onChangeText] = React.useState('');
  const [frontierArray, setFrontierArray] = useState([]);
  const [pgpArray, setPgpArray] = useState([]);
  const [technoArray, setTechnoArray] = useState([]);
  const [deckArray, setDeckArray] = useState([]);
  const [terraceArray, setTerraceArray] = useState([]);
  const [fineFoodsArray, setFineFoodsArray] = useState([]);
  const [flavoursArray, setFlavoursArray] = useState([]);
  const [selectedArray, setSelectedArray] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const openModal = (foodArray) => {
    if (mapLoaded) {
      setSelectedArray(foodArray);
      setModalVisible(true);
    }
  }

  const closeModal = () => {
    setModalVisible(false);
  }

  useEffect(() => {

    const fetchData = async () => {

      const updateFrontier = [];
      const updatePgp = [];
      const updateTechno = [];
      const updateDeck = [];
      const updateTerrace = [];
      const updateFineFoods = [];
      const updateFlavours = [];

      const frontierSnapshot = await getDocs(collection(db, 'Frontier'));
      const pgpSnapshot = await getDocs(collection(db, 'PGP'));
      const technoSnapshot = await getDocs(collection(db, 'Techno'));
      const deckSnapshot = await getDocs(collection(db, 'Deck'));
      const terraceSnapshot = await getDocs(collection(db, 'Terrace'));
      const fineFoodsSnapshot = await getDocs(collection(db, 'Fine Foods'));
      const flavoursSnapshot = await getDocs(collection(db, 'Flavours'));
      
      Promise.all(frontierSnapshot, pgpSnapshot, technoSnapshot, deckSnapshot, terraceSnapshot, fineFoodsSnapshot, flavoursSnapshot);

      frontierSnapshot.forEach((doc) => {
        updateFrontier.push(doc.data());
      })

      pgpSnapshot.forEach((doc) => {
        updatePgp.push(doc.data());
      })

      technoSnapshot.forEach((doc) => {
        updateTechno.push(doc.data());
      })

      deckSnapshot.forEach((doc) => {
        updateDeck.push(doc.data());
      })

      terraceSnapshot.forEach((doc) => {
        updateTerrace.push(doc.data());
      })

      fineFoodsSnapshot.forEach((doc) => {
        updateFineFoods.push(doc.data());
      })

      flavoursSnapshot.forEach((doc) => {
        updateFlavours.push(doc.data());
      })

      setFrontierArray(updateFrontier);
      setPgpArray(updatePgp);
      setTechnoArray(updateTechno);
      setDeckArray(updateDeck);
      setTerraceArray(updateTerrace);
      setFineFoodsArray(updateFineFoods);
      setFlavoursArray(updateFlavours);

    }

    fetchData();

  }, []);

  let MARKERS = [{
    coordinates: { latitude: 1.296567027997948, longitude: 103.78041830499755 },
    name: 'Frontier',
    place: 'Faculty of Science',
    foodArray: frontierArray,
  }, {
    coordinates: { latitude: 1.2908781410186392, longitude: 103.78076955379892 },
    name: 'PGP Canteen',
    place: 'Prince George\'s Park',
    foodArray: pgpArray,
  }, {
    coordinates: { latitude: 1.2977399974538928, longitude: 103.77169897754129 },
    name: 'Techno Edge',
    place: 'College of Design and Engineering',
    foodArray: technoArray,
  }, {
    coordinates: { latitude: 1.294664673995315, longitude: 103.77245672237262 },
    name: 'The Deck',
    place: 'Faculty of Arts & Social Sciences',
    foodArray: deckArray,
  }, {
    coordinates: { latitude: 1.2945013055524734, longitude: 103.77430264881589 },
    name: 'The Terrace',
    place: 'COM3',
    foodArray: terraceArray,
  }, {
    coordinates: { latitude: 1.3039238201203611, longitude: 103.7735817224521 },
    name: 'Fine Food',
    place: 'Town Plaza',
    foodArray: fineFoodsArray,
  }, { 
    coordinates: { latitude: 1.3047119418047308, longitude: 103.77272591212657 },
    name: 'Flavours @ UTown',
    place: 'UTown Stephen Riady Centre',
    foodArray: flavoursArray,
  },
  
  ]

    return (
        <View style={styles.container}>
          <MapView style={styles.map} provider={PROVIDER_GOOGLE} 
            initialRegion={{
              latitude: 1.294774591108752,
              longitude: 103.77405978567056,
              latitudeDelta: 0.0222,
              longitudeDelta: 0.0222,
          }}
            onMapReady={() => setMapLoaded(true)}
          >
          {MARKERS.map((item, index) => (
            <Marker
              key={index}
              coordinate={item.coordinates}
              title={item.name}
              description={item.place}
              onPress={() => {
                openModal(item.foodArray);
                console.log(item.foodArray);
              }}
            />
          ))}
          </ MapView>
          <View style = {styles.inputArea}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              placeholder='e.g. Frontier'
            />
          </View>
          <DisplayFood isVisible={modalVisible} onClose={closeModal} foodArray={selectedArray} />
        </View>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  inputArea: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 15,
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    margin: 15,
    borderWidth: 0,
    width: 300,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
});