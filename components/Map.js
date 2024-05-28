import React from 'react';
import MapView, {Marker} from 'react-native-maps'
import { Text, View, StyleSheet, TextInput } from "react-native";

const MARKERS = [{
  coordinates: { latitude: 1.296567027997948, longitude: 103.78041830499755 },
  name: 'Frontier',
  place: 'Faculty of Science'
}, {
  coordinates: { latitude: 1.2908781410186392, longitude: 103.78076955379892 },
  name: 'PGP Canteen',
  place: 'Prince George\'s Park'
}, {
  coordinates: { latitude: 1.2977399974538928, longitude: 103.77169897754129 },
  name: 'Techno Edge',
  place: 'College of Design and Engineering'
}, {
  coordinates: { latitude: 1.294664673995315, longitude: 103.77245672237262 },
  name: 'The Deck',
  place: 'Faculty of Arts & Social Sciences'
}, {
  coordinates: { latitude: 1.2945013055524734, longitude: 103.77430264881589 },
  name: 'The Terrace',
  place: 'COM3'
}, {
  coordinates: { latitude: 1.3039238201203611, longitude: 103.7735817224521 },
  name: 'Fine Food',
  place: 'Town Plaza'
}, { 
  coordinates: { latitude: 1.3047119418047308, longitude: 103.77272591212657 },
  name: 'Flavours @ UTown',
  place: 'UTown Stephen Riady Centre'
},

]

export default function Map() {
  const [text, onChangeText] = React.useState('');

    return (
        <View style={styles.container}>
          <MapView style={styles.map} 
            initialRegion={{
              latitude: 1.294774591108752,
              longitude: 103.77405978567056,
              latitudeDelta: 0.0222,
              longitudeDelta: 0.0222,
          }}
          >
          {MARKERS.map((item, index) => (
            <Marker
              key={index}
              coordinate={item.coordinates}
              title={item.name}
              description={item.place}
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