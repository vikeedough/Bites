import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { firebaseApp, firebaseAuth, firebaseDb } from '@/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { arrayUnion, doc, getDoc, getDocsFromCache, setDoc, updateDoc } from 'firebase/firestore';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { err } from 'react-native-svg';

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;
const storage = getStorage();

export default function Post() {

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

    const [locationInput, setLocationInput] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [picture, setPicture] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const user = auth.currentUser;

    const uriToBlob = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    };

    const addImage = async () => {
        let picture = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1,1],
            quality: 1,
        });
        setPicture(picture);
        if (!picture.canceled) {
            setImage(picture.assets[0].uri);
        }
    }

    useEffect(() => {
        if (selectedItem != null) {
            setLocationInput(selectedItem.title);
        } else {
            setLocationInput('');
        }
    }, [selectedItem]);

    const clearLocation = () => {
        setSelectedLocation('');
    }

    const addLocation = () => {
        if (locationInput === '') {
            Alert.alert('Add location failed', 'Please key in or select a location!', [{text: 'Understood'}]);
        }
        setSelectedLocation(locationInput);
    }

    const checkPost = async () => {
        if (caption === '') {
            alert('Please include a caption in your post!');
        } else if (image === null) {
            alert('Please upload a picture for your post!');
        } else {

            try {

                await sendPost();

                const docRef = doc(db, 'users', auth.currentUser.uid);
                const docSnapshot = await getDoc(docRef);

                const numberOfPosts = docSnapshot.data().numberOfPosts;
                const newNumberOfPosts = numberOfPosts + 1;

                await updateDoc(docRef, {
                    numberOfPosts : newNumberOfPosts
                });
    
            }

            catch (error) {
                console.log("Unsucessful, " + error)
            }
           

        }
    }

    const sendPost = async () => {
        setDisabled(true);
        const blob = await uriToBlob(picture.assets[0].uri);
        let timeNow = Date.now();
        console.log(timeNow);
        let pictureRef = ref(storage, user.uid + '/posts/' + timeNow + '.jpeg');
        await uploadBytes(pictureRef, blob).then((snapshot) => {
            console.log('Uploaded picture onto Storage!');
        });
        let url = await getDownloadURL(pictureRef);
        const postsRef = doc(db, "posts", user.uid + '_' + timeNow.toString());
        await setDoc(postsRef, {
            userId: user.uid, 
            pictureURL: url,
            caption: caption,
            timestamp: timeNow,
            comments: [],
            usersLiked: [],
            likes: 0,
            location: selectedLocation,
        }).then(() => {
            setImage(null);
            setCaption('');
            setPicture(null);
            setLocationInput('');
            setSelectedLocation('');
            setSelectedItem(null);
            Alert.alert('', 'Post successfully uploaded!', [{text: 'Understood'}]);
            setDisabled(false);
        });
    }

    const handleDropdownOpen = () => {
        setShowDropdown(true);
    };

    const handleDropdownClose = () => {
        setShowDropdown(false);
    };

    return(
        <AutocompleteDropdownContextProvider>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>

            <View style={styles.topContainer}>
                <View style={styles.topInnerContainer}>
                    <View style={styles.captionContainer}>
                        <Text style={styles.captionText}>Caption</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.description} 
                            placeholder='Add a description!'
                            onChangeText={setCaption}
                            value={caption} 
                            multiline />
                    </View>
                </View>
            </View>

            <View style={styles.imageOuterContainer}>
                <TouchableOpacity style={styles.imageUploadContainer} onPress={addImage}>
                    {
                        image === null ? 
                        <Ionicons name="add-circle-outline" color={"black"} size={24} />
                            :
                            <Image source={{uri: image}} style={styles.uploadedImage} />
                        
                    }
                </TouchableOpacity>

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
                        placeholder: 'E.g. Frontier',
                        style: styles.dropdownInput
                    }}
                    matchFrom="start"
                    direction="up"
                    open={showDropdown}
                    onShow={handleDropdownOpen}
                    onHide={handleDropdownClose}
                    value={locationInput}
                    onChangeText={setLocationInput}
                />

                {selectedLocation != ''
                    ?  <View>
                            <Text style={{textAlign: 'center'}}>Selected location: {selectedLocation}</Text>
                            <View style={styles.locationContainer}>
                            <TouchableOpacity style={styles.imageTextContainer} onPress={clearLocation}>
                                <Ionicons name="location-sharp" color={"black"} size={18} />
                                <Text style={styles.addLocationText}>Remove Location</Text>
                                <Ionicons name="chevron-forward" color={"grey"} size={18} />
                            </TouchableOpacity>
                            </View>
                        </View>
                        
                    : <View style={styles.locationContainer}>
                        <TouchableOpacity style={styles.imageTextContainer} onPress={addLocation}>
                            <Ionicons name="location-sharp" color={"black"} size={18} />
                            <Text style={styles.addLocationText}>Add Location</Text>
                            <Ionicons name="chevron-forward" color={"grey"} size={18} />
                        </TouchableOpacity>
                        </View>
                }

                
            </View>
            

            <TouchableOpacity style={styles.postButton} onPress={checkPost} disabled={disabled}>
                <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>
        </AutocompleteDropdownContextProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
    },
    captionContainer: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'left',
        marginHorizontal: 20,
        marginTop: 10,
    },
    topContainer: {
        display: 'flex',
        width: '100%',
        paddingHorizontal: 5,
    },
    imageOuterContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        borderRadius: 20,
        paddingHorizontal: 5,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
    },
    topInnerContainer: {
        display: 'flex',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        margin: 10,
    },
    captionText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        textAlignVertical: 'center',
    },
    inputContainer: {
        display: 'flex',
        padding: 15,
    },
    description: {
        borderColor: 'rgba(224, 224, 224, 1)',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        justifyContent: 'center',
        fontSize: 12,
        lineHeight: 17,
        width: '100%',
        minHeight: 100,
        fontSize: 18,
        backgroundColor: '#FFFFFF'
    },
    imageUploadContainer: {
        borderColor: 'rgba(190, 190, 190, 1)',
        borderWidth: 1,
        borderRadius: 12,
        borderStyle: 'dashed',
        display: 'flex',
        marginVertical: 15,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
    },
    uploadedImage: {
        position: 'relative',
        width: '100%',
        margin: 30,
        aspectRatio: 1,
    },
    locationContainer: {
        display: 'flex',
        marginVertical: 15,
        alignItems: 'center',
        borderColor: 'rgba(224, 224, 224, 1)',
        borderWidth: 1,
        borderRadius: 8,
        width: '70%',
    },
    imageTextContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,      
    },
    addLocationText: {
        fontSize: 18,
    },
    postButton: {
        display: 'flex',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#EC6337',
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginTop: 20,
    },
    postButtonText: {
        fontSize: 18,
        color: 'white',
    },
    dropdownContainer: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(224, 224, 224, 1)',
    },
    suggestionsListContainer: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        top: -70,
        zIndex: 5,
    },
    input: {
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
        borderColor: 'rgba(224, 224, 224, 1)',
    },

});