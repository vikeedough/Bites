import React, { useEffect, useState, useRef } from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps'
import { Text, View, StyleSheet, TextInput } from "react-native";
import { firebaseAuth, firebaseDb } from '@/firebaseConfig';
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import DisplayFood from '@/components/Modals/DisplayFood.js';
import { useNavigation } from '@react-navigation/native';

const auth = firebaseAuth;
const db = firebaseDb;

export default function Map() {

  const navigation = useNavigation();
  const mapRef = useRef(null);
  const markerRef = useRef({});

  const [frontierArray, setFrontierArray] = useState([]);
  const [pgpArray, setPgpArray] = useState([]);
  const [technoArray, setTechnoArray] = useState([]);
  const [deckArray, setDeckArray] = useState([]);
  const [terraceArray, setTerraceArray] = useState([]);
  const [fineFoodsArray, setFineFoodsArray] = useState([]);
  const [flavoursArray, setFlavoursArray] = useState([]);
  const [selectedArray, setSelectedArray] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (foodArray, title) => {
    if (mapLoaded) {
      setSelectedArray(foodArray);
      setSelectedTitle(title);
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

  useEffect(() => {
    if(selectedItem != null) {
      openModal(selectedItem.foodArray, selectedItem.title);
      mapRef.current.animateToRegion({
        latitude: selectedItem.coordinates.latitude - 0.0022,
        longitude: selectedItem.coordinates.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
      markerRef.current[selectedItem.id].showCallout();
    }
  }, [selectedItem])

  let MARKERS = [{
    coordinates: { latitude: 1.296567027997948, longitude: 103.78041830499755 },
    name: 'Frontier',
    title: 'Frontier',
    place: 'Faculty of Science',
    foodArray: frontierArray,
    id: 0,
  }, {
    coordinates: { latitude: 1.2908781410186392, longitude: 103.78076955379892 },
    name: 'PGP Canteen',
    title: 'PGP Canteen',
    place: 'Prince George\'s Park',
    foodArray: pgpArray,
    id: 1,
  }, {
    coordinates: { latitude: 1.2977399974538928, longitude: 103.77169897754129 },
    name: 'Techno Edge',
    title: 'Techno Edge',
    place: 'College of Design and Engineering',
    foodArray: technoArray,
    id: 2,
  }, {
    coordinates: { latitude: 1.294664673995315, longitude: 103.77245672237262 },
    name: 'The Deck',
    title: 'The Deck',
    place: 'Faculty of Arts & Social Sciences',
    foodArray: deckArray,
    id: 3,
  }, {
    coordinates: { latitude: 1.2945013055524734, longitude: 103.77430264881589 },
    name: 'The Terrace',
    title: 'The Terrace',
    place: 'COM3',
    foodArray: terraceArray,
    id: 4,
  }, {
    coordinates: { latitude: 1.3039238201203611, longitude: 103.7735817224521 },
    name: 'Fine Food',
    title: 'Fine Food',
    place: 'Town Plaza',
    foodArray: fineFoodsArray,
    id: 5,
  }, { 
    coordinates: { latitude: 1.3047119418047308, longitude: 103.77272591212657 },
    name: 'Flavours @ UTown',
    title: 'Flavours @ UTown',
    place: 'UTown Stephen Riady Centre',
    foodArray: flavoursArray,
    id: 6,
  },
  
  ]

    return (
      <AutocompleteDropdownContextProvider>
        <View style={styles.container}>
          <MapView 
            ref={mapRef}
            style={styles.map} 
            provider={PROVIDER_GOOGLE} 
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
              ref={(ref) => (markerRef.current[item.id] = ref)}
              onPress={() => {
                openModal(item.foodArray, item.title);
              }}
            />
          ))}
          </ MapView>
          <View style = {styles.inputArea}>
            <AutocompleteDropdown
              clearOnFocus={false}
              closeOnBlur={true}
              closeOnSubmit={false}
              onSelectItem={setSelectedItem}
              dataSet={MARKERS}
              containerStyle={styles.dropdownContainer}
              suggestionsListContainerStyle={styles.suggestionsListContainer}
              inputContainerStyle={styles.input}
              emptyResultText={'No such place found!'}
              textInputProps={{
                placeholder: 'E.g. Frontier'
              }}
            />
          </View>
          <DisplayFood isVisible={modalVisible} onClose={closeModal} foodArray={selectedArray} title={selectedTitle} navigation={navigation}/>
        </View>
      </AutocompleteDropdownContextProvider>
      );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  inputArea: {
    display: 'flex',
    position: 'absolute',
    top: 5,
    left: 15,
    right: 15,
    zIndex: 1,
  },
  dropdownContainer: {
    zIndex: 2,
  },
  suggestionsListContainer: {
    top: -80,
    zIndex: 3,
  },
  input: {
    borderWidth: 0,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
});