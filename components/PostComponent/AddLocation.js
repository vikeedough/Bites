import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

export default function AddLocation({navigation, route}) {

    const { setLocation } = route.params;

    // Hardcoded locations
    const MARKERS = [{
        title: 'Frontier',
        id: 0,
    }, {
        title: 'PGP Canteen',
        id: 1,
    }, {
        title: 'Techno Edge',
        id: 2,
    }, {
        title: 'The Deck',
        id: 3,
    }, {
        title: 'The Terrace',
        id: 4,
    }, {
        title: 'Fine Food',
        id: 5,
    }, {
        title: 'Flavours',
        id: 6,
    }];

    const [input, setInput] = useState('');
    const [newMarkers, setNewMarkers] = useState(MARKERS);

    // Add new location if user types in input
    useEffect(() => {
        if (input !== '') {
            const newMarker = {
                title: input,
                id: 7
            }
            const filteredMarkers = newMarkers.filter(marker => marker.id !== 7);
            setNewMarkers([newMarker, ...filteredMarkers]);
        } else {
            setNewMarkers(MARKERS);
        }
    }, [input])

    // Display each location
    const Result = ({ name }) => {

        // Add location to post
        const addLocation = () => {
            setLocation(name);
            navigation.goBack();
        }

        return (
            <View style={styles.cardContainer}>
                <Text style={styles.locationText}>{name}</Text>
                <TouchableOpacity 
                    style={styles.buttonContainer}
                    onPress={addLocation}
                >
                    <Text style={styles.buttonText}>Add Location</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderItem = ({item}) => <Result name={item.title} />

    return (
        <View style={styles.container}>

            <View style={styles.topContainer}>
                <View style={styles.inputContainer}>
                    <AntDesign.Button 
                        name='search1' 
                        backgroundColor="#FFFFFF" 
                        color= '#EC6337' 
                        size = {15} 
                        style={{paddingEnd: 0, marginEnd: -5, marginStart: -5, }}
                        borderRadius={10}
                    />
                    <TextInput 
                        style={styles.input}
                        placeholder='Add in your own location here...'
                        value={input}
                        onChangeText={setInput}
                    />
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <FlatList 
                    data={newMarkers}
                    style={styles.flatList}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#F4F4F6'
    },
    topContainer: {
        height: '10%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    bottomContainer: {
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        width: '90%',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#EC6337',
        backgroundColor: '#FFFFFF',
        height: 35,
    },
    input: {
        width: '93%',
    },
    flatList: {
        display: 'flex',
        width: '80%',
    },
    cardContainer: {
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        padding: 22,
        marginVertical: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationText: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        backgroundColor: '#EC6337',
        borderRadius: 40,
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    buttonText: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '400',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
})